const pool = require('../utils/db');

const getSinglePsychologist = async (client) => {
    const result = await client.query(
        `SELECT psychologist_id
         FROM psychologist
         LIMIT 1`
    );

    if (result.rowCount === 0) {
        throw new Error('No psychologist found in system');
    }

    return result.rows[0].psychologist_id;
};

//CREATE TEST

exports.createTest = async (client, testData) => {
    const {
        name,
        min_mark,
        max_mark,
        orientation,
        recommended_class,
        questions
    } = testData;

    const psychologist_id = await getSinglePsychologist(client);

    // 1. CREATE TEST
    const testResult = await client.query(
        `INSERT INTO test
         (name, min_mark, max_mark, orientation, recommended_class, psychologist_id)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING test_id`,
        [name, min_mark, max_mark, orientation, recommended_class, psychologist_id]
    );

    const test_id = testResult.rows[0].test_id;

    // 2. CREATE QUESTIONS + ANSWERS
    for (const q of questions || []) {
        const questionResult = await client.query(
            `INSERT INTO question (question, answers_number, test_id)
             VALUES ($1, $2, $3)
             RETURNING question_id`,
            [q.question, q.answers.length, test_id]
        );

        const question_id = questionResult.rows[0].question_id;

        for (const a of q.answers || []) {
            await client.query(
                `INSERT INTO answer (answer, mark, answer_type, question_id)
                 VALUES ($1,$2,$3,$4)`,
                [a.answer, a.mark, a.answer_type, question_id]
            );
        }
    }

    return { test_id };
};


// GET ALL TESTS (SUMMARY)

exports.getAllTests = async () => {
    const result = await pool.query(
        `SELECT 
            test_id,
            name,
            orientation,
            recommended_class
         FROM test
         ORDER BY test_id`
    );

    return result.rows;
};


// GET FULL TEST (QUESTIONS + ANSWERS FLAT)

exports.getTestFull = async (test_id) => {
    const result = await pool.query(
        `
        SELECT 
            t.test_id,
            t.name,
            t.orientation,
            t.min_mark,
            t.max_mark,

            q.question_id,
            q.question,

            a.answer_id,
            a.answer,
            a.mark,
            a.answer_type

        FROM test t
        LEFT JOIN question q ON q.test_id = t.test_id
        LEFT JOIN answer a ON a.question_id = q.question_id
        WHERE t.test_id = $1
        ORDER BY q.question_id, a.answer_id
        `,
        [test_id]
    );

    return result.rows;
};

// UPDATE TEST
exports.updateTestStrict = async (client, test_id, data) => {
    const {
        name,
        min_mark,
        max_mark,
        orientation,
        recommended_class,
        questions
    } = data;

    const psychologist_id = await getSinglePsychologist(client);

    // 1. UPDATE TEST ONLY
    await client.query(
        `UPDATE test
         SET name=$1,
             min_mark=$2,
             max_mark=$3,
             orientation=$4,
             recommended_class=$5,
             psychologist_id=$6
         WHERE test_id=$7`,
        [
            name,
            min_mark,
            max_mark,
            orientation,
            recommended_class,
            psychologist_id,
            test_id
        ]
    );

    // 2. UPDATE QUESTIONS + ANSWERS ONLY (NO INSERT, NO DELETE)
    for (const q of questions || []) {
        if (!q.question_id) {
            throw new Error("question_id is required for strict update mode");
        }

        // update question
        await client.query(
            `UPDATE question
             SET question=$1
             WHERE question_id=$2 AND test_id=$3`,
            [q.question, q.question_id, test_id]
        );

        for (const a of q.answers || []) {
            if (!a.answer_id) {
                throw new Error("answer_id is required for strict update mode");
            }

            await client.query(
                `UPDATE answer
                 SET answer=$1,
                     mark=$2,
                     answer_type=$3
                 WHERE answer_id=$4`,
                [a.answer, a.mark, a.answer_type, a.answer_id]
            );
        }
    }

    return { test_id };
};

exports.getCardByUser = async (client, user_id) => {
    const result = await client.query(
        `SELECT electronic_card_id
         FROM electronic_card
         WHERE user_id = $1`,
        [user_id]
    );

    return result.rows[0];
};


// Get all cards by class
exports.getCardsByClass = async (client, class_id) => {
    const result = await client.query(
        `SELECT ec.electronic_card_id
         FROM electronic_card ec
         JOIN users u ON u.user_id = ec.user_id
         WHERE u.class_id = $1`,
        [class_id]
    );

    return result.rows;
};


// Assign test to card
exports.assignTest = async (client, electronic_card_id, test_id) => {
    await client.query(
        `INSERT INTO electronic_card_test (electronic_card_id, test_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [electronic_card_id, test_id]
    );
};