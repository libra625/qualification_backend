const complainService = require("../services/complainServices");

// GET /complain/:user_id
exports.getComplainsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) res.status(400).json({ message: "no id"});

        const data = await complainService.getComplainsByUserId(user_id);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /complain
exports.createComplain = async (req, res) => {
    try {
        const { problem, date, electronic_card_id, newDiagnosis, newRecommendation } = req.body;

        // validation
        if (!problem || !date || !electronic_card_id || !newDiagnosis || !newRecommendation) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const data = await complainService.createComplain(req.body);

        res.status(201).json({
            message: "Complain was created"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};