const consultationServices = require('../services/consultationServices');
const {validDays} = require("../utils/validDays");

exports.getUserPending = async (req, res) => {
    try {
        const userId = req.userId;
        const data = await consultationServices.getUserPending(userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createConsultation = async (req, res) => {
    try {
        const {
            day_of_week,
            time,
            is_online,
            link
        } = req.body;

        if (!day_of_week || time == null || is_online == null) {
            console.log(req.body)
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (!validDays.includes(day_of_week)) {
            return res.status(400).json({ error: "Invalid day_of_week" });
        }

        if (!time) {
            return res.status(400).json({ error: 'time is required' });
        }

        if (typeof is_online !== 'boolean') {
            return res.status(400).json({ error: 'is_online is required' });
        }

        if (is_online && !link) {
            return res.status(400).json({
                message: "link is required for online sessions"
            });
        }

        // normalize time (supports "10:30", "10:30:00")
        let normalizedTime = time;

        if (typeof normalizedTime === "string" && normalizedTime.length === 8) {
            normalizedTime = normalizedTime.slice(0, 5);
        }

        const [hours, minutes] = normalizedTime.split(":").map(Number);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours > 23 ||
            minutes > 59
        ) {
            return res.status(400).json({
                message: "Invalid time value"
            });
        }

        const formattedTime =
            String(hours).padStart(2, '0') +
            ':' +
            String(minutes).padStart(2, '0');


        const result = await consultationServices.createConsultation({
            day_of_week: day_of_week.toLowerCase(),
            time: formattedTime,
            is_online,
            link: is_online ? link : null,
            user_id: req.userId,
        });

        res.status(201).json({
            message: 'Consultation created successfully',
            success: true
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPsychologistPending = async (req, res) => {
    try {
        const data = await consultationServices.getPsychologistPending();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeConsultation = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await consultationServices.completeConsultation(id);
        res.status(200).json({
            message: 'Consultation updated to done',
            success: true
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};