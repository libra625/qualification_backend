const pool = require('../utils/db');
const TestModel = require('../models/testModel');


// CREATE TEST
exports.createTest = async (data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await TestModel.createTest(client, data);

        await client.query('COMMIT');

        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};


//GET ALL TESTS
exports.getAllTests = async () => {
    return await TestModel.getAllTests();
};


//BUILD NESTED TEST STRUCTURE
exports.getTestById = async (test_id) => {
    const rows = await TestModel.getTestFull(test_id);

    if (!rows.length) return null;

    const test = {
        test_id: rows[0].test_id,
        name: rows[0].name,
        orientation: rows[0].orientation,
        min_mark: rows[0].min_mark,
        max_mark: rows[0].max_mark,
        questions: []
    };

    const map = new Map();

    for (const row of rows) {
        if (!row.question_id) continue;

        if (!map.has(row.question_id)) {
            const q = {
                question_id: row.question_id,
                question: row.question,
                answers: []
            };

            map.set(row.question_id, q);
            test.questions.push(q);
        }

        if (row.answer_id) {
            map.get(row.question_id).answers.push({
                answer_id: row.answer_id,
                answer: row.answer,
                mark: row.mark,
                answer_type: row.answer_type
            });
        }
    }

    return test;
};

// UPDATE TEST
exports.updateTestStrict = async (test_id, data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await TestModel.updateTestStrict(client, test_id, data);

        await client.query('COMMIT');

        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// Assign test to ONE user
exports.assignToUser = async (user_id, test_id) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const card = await TestModel.getCardByUser(client, user_id);

        if (!card) {
            throw new Error('User has no electronic card');
        }

        await TestModel.assignTest(
            client,
            card.electronic_card_id,
            test_id
        );

        await client.query('COMMIT');

        return { user_id, test_id };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};



// Assign test to CLASS

exports.assignToClass = async (class_id, test_id) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cards = await TestModel.getCardsByClass(client, class_id);

        for (const c of cards) {
            await TestModel.assignTest(
                client,
                c.electronic_card_id,
                test_id
            );
        }

        await client.query('COMMIT');

        return {
            class_id,
            test_id,
            assigned: cards.length
        };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};