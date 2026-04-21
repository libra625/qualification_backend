const model = require("../models/electronicCardModel");

exports.getAllCards = async () => {
    return await model.getAllCards();
};

exports.getCardById = async (id) => {
    const data = await model.getCardById(id);

    if (!data.user || data.user.length === 0) {
        throw new Error("Card not found");
    }

    const user = data.user[0]; // get actual user object

    return {
        ...user,

        counseling: data.counseling,

        complain: data.complain,

        tests: data.tests.map(t => ({
            name: t.name,
            score: t.total_mark ?? null,
            max_score: t.max_mark ?? null
        }))
    };
};

exports.updateCard = async (id, recommendation, diagnosis) => {
    const result = await model.updateCard(id, recommendation, diagnosis);

    if (!result.length) {
        throw new Error("Update failed");
    }

    return result;
};

exports.getStatistics = async () => {
    return model.getStatistics();
};