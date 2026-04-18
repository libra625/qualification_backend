const counselingModel = require("../models/counselingModel");

// GET by user_id
exports.getCounselingByUserId = async (user_id) => {
    const result = await counselingModel.getCounselingByUserId(user_id);
    return result.rows;
};

// CREATE counseling + update electronic_card (append logic is inside model)
exports.createCounseling = async (data) => {
    const {
        problem,
        date,
        electronic_card_id,
        newDiagnosis,
        newRecommendation
    } = data;

    const result = await counselingModel.createCounseling(
        problem,
        date,
        electronic_card_id,
        newDiagnosis,
        newRecommendation
    );

    return result;
};
