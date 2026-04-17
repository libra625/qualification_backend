const pool = require('../utils/db');

exports.findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT user_id, mail, password, role
         FROM users
         WHERE mail = $1`,
        [email]
    );
    return result.rows[0];
};

exports.createUser = async (
    mail,
    hashedPassword,
    name,
    surname,
    middleName,
    username,
    phone,
    parentsPhone,
    classLetter,
    classNumber
) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. get or create class
        const classResult = await client.query(
            `INSERT INTO class (class_number, class_letter)
             VALUES ($1, $2)
             ON CONFLICT (class_number, class_letter)
             DO UPDATE SET class_number = EXCLUDED.class_number
             RETURNING class_id`,
            [classNumber, classLetter]
        );

        const classId = classResult.rows[0].class_id;

        // 2. insert user
        const userResult = await client.query(
            `INSERT INTO users 
            (mail, password, name, surname, middle_name, username, phone, parents_phone, class_id, role)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'user')
            RETURNING user_id, mail, role`,
            [
                mail,
                hashedPassword,
                name,
                surname,
                middleName,
                username,
                phone,
                parentsPhone,
                classId
            ]
        );

        await client.query('COMMIT');

        return userResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};