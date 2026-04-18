const consultationModel = require("../models/consultationModel");

exports.getUserPending = async (userId) => {
    return await consultationModel.getPendingByUser(userId);
};

exports.createConsultation = async (data) => {
    return await consultationModel.createConsultation(data);
};

exports.getPsychologistPending = async () => {
    return await consultationModel.getPendingForPsychologist();
};

exports.completeConsultation = async (id) => {
    return await consultationModel.markAsDone(id);
};