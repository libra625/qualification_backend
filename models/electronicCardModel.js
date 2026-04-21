const pool = require("../utils/db");


// 1. GET ALL CARDS
exports.getAllCards = async () => {
    const result = await pool.query(`
        SELECT 
            ec.electronic_card_id,
            u.user_id,
            u.surname,
            u.name,
            u.middle_name
        FROM electronic_card ec
        JOIN users u ON u.user_id = ec.user_id
        ORDER BY ec.electronic_card_id
    `);

    return result.rows;
};


// 2. GET CARD BY ID
exports.getCardById = async (id) => {

    const user = await pool.query(`
        SELECT 
            ec.electronic_card_id,
            u.user_id,
            u.surname,
            u.name,
            u.middle_name,
            ec.recommendation,
            ec.diagnosis
        FROM electronic_card ec
        JOIN users u ON u.user_id = ec.user_id
        WHERE ec.electronic_card_id = $1
    `, [id]);

    const counseling = await pool.query(`
        SELECT problem, date
        FROM counseling
        WHERE electronic_card_id = $1
    `, [id]);

    const complain = await pool.query(`
        SELECT problem, date
        FROM complain
        WHERE electronic_card_id = $1
    `, [id]);

    const tests = await pool.query(`
        SELECT
            t.name,
            tr.total_mark,
            t.max_mark
        FROM test_result tr
                 JOIN test t ON t.test_id = tr.test_id
        WHERE tr.user_id = (
            SELECT user_id
            FROM electronic_card
            WHERE electronic_card_id = $1
        )
    `, [id]);

    return {
        user: user.rows,
        counseling: counseling.rows,
        complain: complain.rows,
        tests: tests.rows
    };
};


// 3. UPDATE CARD
exports.updateCard = async (id, recommendation, diagnosis) => {
    const result = await pool.query(`
        UPDATE electronic_card
        SET recommendation = $1,
            diagnosis = $2
        WHERE electronic_card_id = $3
        RETURNING *
    `, [recommendation, diagnosis, id]);

    return result.rows;
};


// 4. STATISTICS
exports.getStatistics = async () => {

    const consultationsDone = await pool.query(`
        SELECT COUNT(*) 
        FROM consultation
        WHERE status = 'done'
    `);

    const consultationsPlanned = await pool.query(`
        SELECT COUNT(*) 
        FROM consultation
        WHERE status = 'pending'
    `);

    const classStats = await pool.query(`
        SELECT
            c.class_id,
            c.class_number,
            c.class_letter,

            COUNT(DISTINCT u.user_id) AS total_students,

            COUNT(DISTINCT tr.user_id) AS passed_tests,

            COUNT(DISTINCT u.user_id) FILTER (
                WHERE EXISTS (
                    SELECT 1 FROM counseling cs
                    WHERE cs.electronic_card_id = ec.electronic_card_id
                )
                    OR EXISTS (
                        SELECT 1 FROM complain cp
                        WHERE cp.electronic_card_id = ec.electronic_card_id
                    )
                ) AS problem_students

        FROM class c
                 LEFT JOIN users u ON u.class_id = c.class_id
                 LEFT JOIN electronic_card ec ON ec.user_id = u.user_id
                 LEFT JOIN test_result tr ON tr.user_id = u.user_id

        GROUP BY c.class_id
        ORDER BY c.class_number, c.class_letter;
    `);

    return {
        consultations_done: consultationsDone.rows[0].count,
        consultations_planned: consultationsPlanned.rows[0].count,
        classes: classStats.rows
    };
};