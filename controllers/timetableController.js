const timetableService = require("../services/timetableServices");
const { validDays } = require("../utils/validDays");

exports.getTimetable = async (req, res) => {
    try {
        const result = await timetableService.getTimetable();

        res.status(200).json({
            message: "timetable was given",
            data: result,
        });
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error",
        });
    }
};

exports.createTimetable = async (req, res) => {
    try {
        const {
            day_of_week,
            start_time,
            end_time,
            is_online,
            link
        } = req.body;

        if (!day_of_week || start_time== null || end_time== null || is_online== null) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (!validDays.includes(day_of_week.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid day_of_week"
            });
        }

        if (is_online && !link) {
            return res.status(400).json({
                message: "link is required for online sessions"
            });
        }

        const result = await timetableService.createTimetable({
            day_of_week: day_of_week.toLowerCase(),
            start_time,
            end_time,
            is_online,
            link: is_online ? link : null
        });

        res.status(201).json({
            message: "timetable was created",
            data: result
        });

    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "incorrect params"
            });
        }

        const {
            day_of_week,
            start_time,
            end_time,
            is_online,
            link
        } = req.body;

        if (!day_of_week || start_time == null || end_time == null || is_online == null) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (is_online && !link) {
            return res.status(400).json({
                message: "link is required for online sessions"
            });
        }

        const result = await timetableService.updateTimetable(id, {
            day_of_week: day_of_week.toLowerCase(),
            start_time,
            end_time,
            is_online,
            link: is_online ? link : null
        });

        res.status(200).json({
            message: "timetable was updated. all changes will take effect next week",
            data: result,
        });
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error",
        });
    }
};