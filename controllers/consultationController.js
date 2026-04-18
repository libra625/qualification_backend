const consultationServices = require('../services/consultationServices');

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
        const { date, is_online } = req.body;

        let { time } = req.body;

        if (!time) {
            return res.status(400).json({ error: 'time is required' });
        }

        if (!date) {
            return res.status(400).json({ error: 'date is required' });
        }

        if (typeof is_online !== 'boolean') {
            return res.status(400).json({ error: 'is_online is required' });
        }

        // convert number → HH:MM string
        const hours = Math.floor(time / 100);
        const minutes = time % 100;

        if (hours > 23 || minutes > 59) {
            return res.status(400).json({ error: 'Invalid time value' });
        }

        const formattedTime =
            String(hours).padStart(2, '0') +
            ':' +
            String(minutes).padStart(2, '0');


        const data = await consultationServices.createConsultation({
            ...req.body,
            time: formattedTime,
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