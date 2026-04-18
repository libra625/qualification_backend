const counselingService  = require("../services/counselingServices");

// GET /counseling/:user_id
exports.getCounselingByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) res.status(400).json({ message: "no id"});

        const data = await counselingService.getCounselingByUserId(user_id);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /counseling
exports.createCounseling = async (req, res) => {
    try {

        const { problem, date, electronic_card_id, newDiagnosis, newRecommendation } = req.body;

        // validation
        if (!problem || !date || !electronic_card_id || !newDiagnosis || !newRecommendation) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const data = await counselingService.createCounseling(req.body);

        res.status(201).json({
            message: "Counseling was created"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};