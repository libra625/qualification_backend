const pool = require('../utils/db');


exports.getAnswersMarks = async (client, answers) => {
    const ids = answers
        .filter(a => a.answer_id)
        .map(a => a.answer_id);

    if (!ids.length) return [];

    const result = await client.query(
        `SELECT answer_id, mark
         FROM answer
         WHERE answer_id = ANY($1)`,
        [ids]
    );

    return result.rows;
};


exports.createTestResult = async (client, user_id, test_id, total_mark) => {
    const result = await client.query(
        `INSERT INTO test_result (user_id, test_id, total_mark)
         VALUES ($1,$2,$3)
         RETURNING test_result_id`,
        [user_id, test_id, total_mark]
    );

    return result.rows[0].test_result_id;
};


exports.insertAnsweredQuestion = async (
    client,
    test_result_id,
    question_id,
    answer_id,
    answer_text
) => {
    await client.query(
        `INSERT INTO answered_question
        (test_result_id, question_id, answer_id, answer_text)
        VALUES ($1,$2,$3,$4)`,
        [test_result_id, question_id, answer_id || null, answer_text || null]
    );
};


exports.getTestMaxMark = async (test_id) => {
    const result = await pool.query(
        `SELECT max_mark FROM test WHERE test_id = $1`,
        [test_id]
    );

    return result.rows[0];
};


exports.getUserEmail = async (user_id) => {
    const result = await pool.query(
        `SELECT mail FROM users WHERE user_id = $1`,
        [user_id]
    );

    return result.rows[0];
};


exports.getUserResult = async (user_id, test_id) => {
    const result = await pool.query(
        `SELECT 
            u.name,
            u.surname,
            u.middle_name,
            tr.total_mark
         FROM test_result tr
         JOIN users u ON u.user_id = tr.user_id
         WHERE tr.user_id = $1 AND tr.test_id = $2`,
        [user_id, test_id]
    );

    return result.rows[0];
};



// NEW: Pending tests (assigned but not passed)

exports.getPendingTests = async (user_id) => {
    const result = await pool.query(
        `
        SELECT t.test_id, t.name
        FROM electronic_card_test ect
        JOIN electronic_card ec ON ec.electronic_card_id = ect.electronic_card_id
        JOIN test t ON t.test_id = ect.test_id

        WHERE ec.user_id = $1

        AND NOT EXISTS (
            SELECT 1
            FROM test_result tr
            WHERE tr.user_id = $1
              AND tr.test_id = t.test_id
        )
        `,
        [user_id]
    );

    return result.rows;
};