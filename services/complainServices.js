const ComplainModel = require("../models/complainModel");

// GET by user_id
exports.getComplainsByUserId = async (user_id) => {
    const result = await ComplainModel.getComplainsByUserId(user_id);
    return result.rows;
};

// CREATE complain + update electronic_card (append logic is inside model)
exports.createComplain = async (data) => {
    const {
        problem,
        date,
        electronic_card_id,
        newDiagnosis,
        newRecommendation
    } = data;

    const result = await ComplainModel.createComplain(
        problem,
        date,
        electronic_card_id,
        newDiagnosis,
        newRecommendation
    );

    return result;
};