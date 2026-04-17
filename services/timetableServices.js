const timetableModel = require("../models/timetableModel");

exports.getTimetable = async () => {
    return await timetableModel.getAll();
};

exports.createTimetable = async (data) => {
    return await timetableModel.create(data);
};

exports.updateTimetable = async (id, data) => {
    const updated = await timetableModel.update(id, data);

    if (!updated) {
        const error = new Error("Timetable not found");
        error.status = 404;
        throw error;
    }

    return updated;
};