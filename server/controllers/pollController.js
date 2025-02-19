const { Poll, PollOption } = require("../models");
const { emitNewPoll } = require("../sockets/socket");
const Validator = require('validatorjs');


// create new poll
const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        // Validation rules for
        const rules = {
            question: 'required|string|min:3|max:255',
            options: 'required|array|min:2',
            'options.*': 'required|string|min:1|max:255'
        };

        const validation = new Validator(req.body, rules);

        // Check if validation fails and return appropriate response
        if (validation.fails()) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validation.errors.all() 
            });
        }

        // Create poll and its options in the database
        const poll = await Poll.create({ question });
        const pollOptions = options.map(text => ({ text, pollId: poll.id }));
        await PollOption.bulkCreate(pollOptions);

        // Emit new poll to all clients
        emitNewPoll(req.app.get("io"), poll.id);

        res.status(201).json({ message: "Poll created", poll });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all polls
const getPolls = async (req, res) => {
    try {
        // Fetch all polls with their options from the database
        const polls = await Poll.findAll({ include: PollOption });
        res.status(200).json({ polls });
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// vote for a poll
const votePoll = async (req, res) => {
    try {
        const { optionId } = req.body;

        // Validation rules
        const rules = {
            optionId: 'required|string'
        };

        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validation.errors.all() 
            });
        }

        // Find the poll option by its ID
        const pollOption = await PollOption.findByPk(optionId);
        if (!pollOption) {
            return res.status(400).json({ message: "Poll option not found" });
        }

        // Increment the votes count for the poll option
        await pollOption.increment("votes");

        const updatedPoll = await Poll.findOne({
            where: { id: pollOption.pollId },
            include: [{ model: PollOption }],
        });

        // Emit the updated poll to all clients
        req.app.get("io").emit("poll_data", updatedPoll);

        res.status(200).json({ message: "Vote counted!", poll: updatedPoll });
    } catch (error) {
        console.error("Error voting:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createPoll, getPolls, votePoll };
