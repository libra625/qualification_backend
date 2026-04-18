const pool = require("../utils/db");

exports.getPendingByUser = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM consultation 
     WHERE user_id = $1 AND status = 'pending'`,
        [userId]
    );
    return result.rows;
};

exports.createConsultation = async (data) => {
    const { time, date, is_online, link, user_id } = data;

    const result = await pool.query(
        `INSERT INTO consultation (time, date, is_online, link, user_id, psychologist_id, status)
     VALUES ($1, $2, $3, $4, $5, 1, 'pending')
     RETURNING *`,
        [time, date, is_online, link, user_id]
    );

    return result.rows[0];
};

exports.getPendingForPsychologist = async () => {
    const result = await pool.query(
        `SELECT * FROM consultation
     WHERE psychologist_id = 1 AND status = 'pending'`
    );
    return result.rows;
};

exports.markAsDone = async (id) => {
    const result = await pool.query(
        `UPDATE consultation
     SET status = 'done'
     WHERE consultation_id = $1
     RETURNING *`,
        [id]
    );
    return result.rows[0];
};
