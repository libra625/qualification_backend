const Service = require('../services/testResultServices');


// SUBMIT TEST
exports.submitTest = async (req, res) => {
    try {
        const user_id = req.userId;
        const { test_id, answers } = req.body;

        if (!user_id || !test_id || !answers?.length) {
            return res.status(400).json({
                message: 'user_id, test_id and answers required'
            });
        }

        req.body.user_id = req.userId;

        const result = await Service.submitTest(req.body);

        res.status(201).json({
            message: 'Test submitted successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET RESULT
exports.getResult = async (req, res) => {
    try {
        const { user_id, test_id } = req.query;

        if (!user_id || !test_id) {
            return res.status(400).json({
                message: 'user_id and test_id required'
            });
        }

        const result = await Service.getResult(user_id, test_id);

        if (!result) {
            return res.status(404).json({
                message: 'Result not found'
            });
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET PENDING TESTS
exports.getPendingTests = async (req, res) => {
    try {
        const user_id = req.userId;

        if (!user_id) {
            return res.status(400).json({
                message: 'user_id required'
            });
        }

        const tests = await Service.getPendingTests(user_id);

        res.json({
            message: 'Pending tests retrieved',
            data: tests
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET FULL DETAILED RESULT
exports.getDetailedResultFull = async (req, res) => {
    try {
        const { user_id, test_id } = req.query;

        if (!user_id || !test_id) {
            return res.status(400).json({
                message: 'user_id and test_id required'
            });
        }

        const result = await Service.getDetailedResultFull(user_id, test_id);

        if (!result.length) {
            return res.status(404).json({
                message: 'Detailed result not found'
            });
        }

        res.json({
            message: 'Detailed result retrieved',
            data: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL RESULTS BY TEST ID
exports.getTestResultsByTestId = async (req, res) => {
    try {
        const { test_id } = req.query;

        if (!test_id) {
            return res.status(400).json({
                message: 'test_id required'
            });
        }

        const results = await Service.getTestResultsByTestId(test_id);

        if (!results.length) {
            return res.status(404).json({
                message: 'No results found for this test'
            });
        }

        res.json({
            message: 'Test results retrieved',
            data: results
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};