const pool = require('../utils/db');
const Model = require('../models/testResultModel');
const sendMail = require("../utils/mailer");


const sendEmail = async (email, message) => {
    await sendMail({
        to: "18.12.17.moyo@gmail.com",
        subject: "Low test result",
        text: `This is a test email informing u of your ${message} `,
        html: '<h1>This is a test email informing u of your ${message}</h1>'
    });
};


// SUBMIT TEST
exports.submitTest = async (data) => {
    const { user_id, test_id, answers } = data;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. calculate score (ONLY answer_id based)
        const marksData = await Model.getAnswersMarks(client, answers);

        let total = 0;

        for (const ans of answers) {
            if (!ans.answer_id) continue;

            const found = marksData.find(
                m => m.answer_id === ans.answer_id
            );

            if (found) total += found.mark || 0;
        }

        // 2. create result
        const test_result_id = await Model.createTestResult(
            client,
            user_id,
            test_id,
            total
        );

        // 3. save answers (including answer_text)
        for (const ans of answers) {
            await Model.insertAnsweredQuestion(
                client,
                test_result_id,
                ans.question_id,
                ans.answer_id || null,
                ans.answer_text || null
            );
        }

        await client.query('COMMIT');

        // 4. low score email
        const { max_mark } = await Model.getTestMaxMark(test_id);

        if (total <= max_mark * 0.2) {
            const user = await Model.getUserEmail(user_id);

            if (user?.mail) {
                await sendEmail(
                    user.mail,
                    `Low test result: ${total}/${max_mark}`
                );
            }
        }

        return {
            test_result_id,
            total_mark: total
        };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};


// GET RESULT
exports.getResult = async (user_id, test_id) => {
    return await Model.getUserResult(user_id, test_id);
};


// PENDING TESTS
exports.getPendingTests = async (user_id) => {
    return await Model.getPendingTests(user_id);
};

const formatDetailedResult = (rows) => {
    const questionsMap = {};

    for (const row of rows) {
        if (!questionsMap[row.question_id]) {
            questionsMap[row.question_id] = {
                question_id: row.question_id,
                question: row.question,
                selected_answer_id: row.selected_answer_id,
                answer_text: row.answer_text,
                answers: []
            };
        }

        if (row.answer_id) {
            questionsMap[row.question_id].answers.push({
                answer_id: row.answer_id,
                answer: row.answer,
                mark: row.mark
            });
        }
    }

    return Object.values(questionsMap);
};

exports.getDetailedResultFull = async (user_id, test_id) => {
    const rows = await Model.getDetailedResultFull(user_id, test_id);

    return formatDetailedResult(rows);
};

exports.getTestResultsByTestId = async (test_id) => {
    return await Model.getTestResultsByTestId(test_id);
};