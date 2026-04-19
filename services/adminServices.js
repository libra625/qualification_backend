const pool = require('../utils/db');
const bcrypt = require('bcrypt');
const model = require('../models/adminModel');

// helper: get or create class
const getOrCreateClass = async (client, class_number, class_letter) => {
    const result = await client.query(
        `INSERT INTO class (class_number, class_letter)
         VALUES ($1, $2)
         ON CONFLICT (class_number, class_letter)
         DO UPDATE SET class_number = EXCLUDED.class_number
         RETURNING class_id`,
        [class_number, class_letter]
    );

    return result.rows[0].class_id;
};

// CREATE USER
exports.createUser = async (data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let classId = null;

        if (data.class_number && data.class_letter) {
            classId = await getOrCreateClass(
                client,
                data.class_number,
                data.class_letter
            );
        }
        // HASH PASSWORD HERE
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await model.createUser(client, {
            ...data,
            password: hashedPassword,
            class_id: classId
        });

        await client.query('COMMIT');

        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// GET ALL
exports.getUsers = async () => {
    return await model.getUsersShort();
};

// GET ONE
exports.getUser = async (id) => {
    return await model.getUserById(id);
};

exports.updateUser = async (id, data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. HANDLE CLASS FIRST (IMPORTANT FIX)
        if (data.class_number && data.class_letter) {
            const classResult = await client.query(
                `INSERT INTO class (class_number, class_letter)
                 VALUES ($1, $2)
                 ON CONFLICT (class_number, class_letter)
                     DO UPDATE SET class_number = EXCLUDED.class_number
                 RETURNING class_id`,
                [data.class_number, data.class_letter]
            );

            data.class_id = classResult.rows[0].class_id;

            delete data.class_number;
            delete data.class_letter;
        }

        // 2. HASH PASSWORD IF EXISTS
        if (data.password) {
            const bcrypt = require('bcrypt');
            data.password = await bcrypt.hash(data.password, 10);
        }

        // 3. BUILD UPDATE QUERY SAFELY
        const allowedFields = [
            'surname',
            'name',
            'middle_name',
            'username',
            'mail',
            'phone',
            'parents_phone',
            'role',
            'status',
            'class_id',
            'password'
        ];

        const updates = Object.keys(data).filter(k =>
            allowedFields.includes(k)
        );

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        const setQuery = updates
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        const values = updates.map(k => data[k]);

        const result = await client.query(
            `UPDATE users
             SET ${setQuery}
             WHERE user_id = $${updates.length + 1}
             RETURNING *`,
            [...values, id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// DELETE
exports.disableUser = async (id) => {
    return await model.disableUser(id);
};