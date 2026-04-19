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

// CREATE
exports.createUser = async (client, userData) => {
    const {
        surname,
        name,
        middle_name,
        username,
        password,
        mail,
        phone,
        parents_phone,
        role,
        class_id
    } = userData;

    const psychologist_id = await getSinglePsychologist(client);

    const result = await client.query(
        `INSERT INTO users
         (surname, name, middle_name, username, password, mail, phone, parents_phone, role, class_id, status, psychologist_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active',$11)
         RETURNING user_id`,
        [
            surname,
            name,
            middle_name,
            username,
            password,
            mail,
            phone,
            parents_phone,
            role,
            class_id,
            psychologist_id
        ]
    );

    return result.rows[0];
};

// GET ALL (ONLY ACTIVE)
exports.getUsersShort = async () => {
    const result = await pool.query(
        `SELECT user_id, surname, name, middle_name
         FROM users
         WHERE status = 'active'
         ORDER BY user_id`
    );

    return result.rows;
};

// GET ONE (can include disabled if needed)
exports.getUserById = async (id) => {
    const result = await pool.query(
        `SELECT u.*, c.class_number, c.class_letter
         FROM users u
                  LEFT JOIN class c ON u.class_id = c.class_id
         WHERE u.user_id = $1`,
        [id]
    );

    return result.rows[0];
};

// UPDATE (SAFE FIELD UPDATE)
exports.updateUser = async (id, fields) => {
    const allowedFields = [
        'surname',
        'name',
        'middle_name',
        'username',
        'mail',
        'phone',
        'parents_phone',
        'role',
        'class_id',
        'status'
    ];

    const updates = Object.keys(fields)
        .filter((key) => allowedFields.includes(key));

    if (updates.length === 0) return null;

    const setQuery = updates
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');

    const values = updates.map((key) => fields[key]);

    const result = await pool.query(
        `UPDATE users
         SET ${setQuery}
         WHERE user_id = $${updates.length + 1}
         RETURNING *`,
        [...values, id]
    );

    return result.rows[0];
};

// SOFT DELETE (disable user)
exports.disableUser = async (id) => {
    const result = await pool.query(
        `UPDATE users
         SET status = 'disabled'
         WHERE user_id = $1
         RETURNING user_id, status`,
        [id]
    );

    return result.rows[0];
};