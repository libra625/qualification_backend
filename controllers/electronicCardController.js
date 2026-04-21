const service = require("../services/electronicCardServices");

exports.getAllCards = async (req, res) => {
    try {
        const data = await service.getAllCards();
        console.log(data)
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getCardById = async (req, res) => {
    try {
        const data = await service.getCardById(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const { recommendation, diagnosis } = req.body;
        const data = await service.updateCard(
            req.params.id,
            recommendation,
            diagnosis
        );
        res.json({ message: "Success" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const data = await service.getStatistics();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};