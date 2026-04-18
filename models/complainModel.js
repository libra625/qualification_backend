const pool = require("../utils/db");

exports.getComplainsByUserId = (user_id) => {
    return pool.query(`
        SELECT
            u.name,
            u.surname,
            u.middle_name,
            c.date,
            cl.class_number,
            cl.class_letter,
            ec.diagnosis,
            ec.recommendation,
            c.problem
        FROM complain c
                 JOIN electronic_card ec ON c.electronic_card_id = ec.electronic_card_id
                 JOIN "users" u ON ec.user_id = u.user_id
                 LEFT JOIN class cl ON u.class_id = cl.class_id
        WHERE u.user_id = $1
        ORDER BY c.date DESC
    `, [user_id]);
};

exports.createComplain = async (problem, date, electronic_card_id, newDiagnosis, newRecommendation) => {
    const client = await pool.connect();
    console.log(problem)
    console.log(date)
    console.log(electronic_card_id)
    console.log(newDiagnosis)
    console.log(newRecommendation)

    try {
        await client.query('BEGIN');

        // 1. INSERT complain
        const complainResult = await client.query(
            `INSERT INTO complain (problem, date, electronic_card_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [problem, date, electronic_card_id]
        );

        // 2. UPDATE electronic_card (append values)
        await client.query(
            `UPDATE electronic_card
             SET
                 diagnosis = CASE
                                 WHEN diagnosis IS NULL OR diagnosis = '' THEN $1::text
                                 ELSE CONCAT(diagnosis, ' | ', $1::text)
                     END,
                 recommendation = CASE
                                      WHEN recommendation IS NULL OR recommendation = '' THEN $2::text
                                      ELSE CONCAT(recommendation, ' | ', $2::text)
                     END
             WHERE electronic_card_id = $3`,
            [newDiagnosis, newRecommendation, electronic_card_id]
        );

        await client.query('COMMIT');

        return complainResult.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
