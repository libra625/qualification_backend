const TestService = require('../services/testServices');


// CREATE TEST
exports.createTest = async (req, res) => {
    try {
        const body = req.body;

        // BASIC VALIDATION
        if (!body.name || !body.questions || !body.questions.length) {
            return res.status(400).json({
                message: "Test must have name and at least one question"
            });
        }

        // QUESTION VALIDATION
        for (const q of body.questions) {
            if (!q.question || !q.answers || !q.answers.length) {
                return res.status(400).json({
                    message: "Each question must have text and answers"
                });
            }
        }

        const test = await TestService.createTest(body);

        res.status(201).json(test);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL TESTS
exports.getAllTests = async (req, res) => {
    try {
        const tests = await TestService.getAllTests();
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET TEST BY ID
exports.getTestById = async (req, res) => {
    try {
        const test = await TestService.getTestById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json(test);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// UPDATE TEST
exports.updateTest = async (req, res) => {
    try {
        const body = req.body;

        if (!body.questions?.length) {
            return res.status(400).json({
                message: "Questions are required"
            });
        }

        const result = await TestService.updateTestStrict(
            req.params.id,
            body
        );

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.assignToUser = async (req, res) => {
    try {
        const { user_id, test_id } = req.body;

        if (!user_id || !test_id) {
            return res.status(400).json({
                message: 'user_id and test_id required'
            });
        }

        const result = await TestService.assignToUser(user_id, test_id);

        res.status(201).json({
            message: `Test assigned to user`,
            data: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Assign test to CLASS
exports.assignToClass = async (req, res) => {
    try {
        const { class_id, test_id } = req.body;

        if (!class_id || !test_id) {
            return res.status(400).json({
                message: 'class_id and test_id required'
            });
        }

        const result = await TestService.assignToClass(class_id, test_id);

        res.status(201).json({
            message: `Test assigned to class`,
            data: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};