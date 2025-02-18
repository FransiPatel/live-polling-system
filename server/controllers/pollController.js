const { Poll, PollOption } = require("../models");
const { emitNewPoll } = require("../sockets/socket");
const Validator = require('validatorjs');

const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        const rules = {
            question: 'required|string|min:3|max:255',
            options: 'required|array|min:2',
            'options.*': 'required|string|min:1|max:255'
        };

        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validation.errors.all() 
            });
        }

        const poll = await Poll.create({ question });
        const pollOptions = options.map(text => ({ text, pollId: poll.id }));
        await PollOption.bulkCreate(pollOptions);

        emitNewPoll(req.app.get("io"), poll.id);

        res.status(201).json({ message: "Poll created", poll });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getPolls = async (req, res) => {
    try {
        const polls = await Poll.findAll({ include: PollOption });
        res.status(200).json({ polls });
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const votePoll = async (req, res) => {
    try {
        const { optionId } = req.body;

        const rules = {
            optionId: 'required|string|uuid'
        };

        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validation.errors.all() 
            });
        }

        const pollOption = await PollOption.findByPk(optionId);
        if (!pollOption) {
            return res.status(400).json({ message: "Poll option not found" });
        }

        await pollOption.increment("votes");

        const updatedPoll = await Poll.findOne({
            where: { id: pollOption.pollId },
            include: [{ model: PollOption }],
        });

        req.app.get("io").emit("poll_data", updatedPoll);

        res.status(200).json({ message: "Vote counted!", poll: updatedPoll });
    } catch (error) {
        console.error("Error voting:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createPoll, getPolls, votePoll };
