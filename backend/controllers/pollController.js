const { Poll, PollOption } = require("../models");
const { SOCKET_EVENTS } = require("../constants");

/**
 * Create a new poll with options
 */
const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Invalid poll data. Provide a question and at least two options." });
        }

        // Create Poll
        const poll = await Poll.create({ question });

        // Create Poll Options
        const pollOptions = options.map(option => ({
            text: option,
            pollId: poll.id,
        }));
        await PollOption.bulkCreate(pollOptions);

        res.status(201).json({ message: "Poll created successfully!", poll });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get all polls with options
 */
const getPolls = async (req, res) => {
    try {
        const polls = await Poll.findAll({
            include: [{ model: PollOption }],
        });

        res.status(200).json({ polls });
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Vote on a poll option
 */
const votePoll = async (req, res) => {
    try {
        const { optionId } = req.body;

        if (!optionId) {
            return res.status(400).json({ message: "Option ID is required." });
        }

        // Find option and increment vote count
        const pollOption = await PollOption.findByPk(optionId);
        if (!pollOption) {
            return res.status(404).json({ message: "Poll option not found." });
        }

        await pollOption.increment("votes");

        // Fetch updated poll results
        const updatedPoll = await Poll.findOne({
            where: { id: pollOption.pollId },
            include: [{ model: PollOption }],
        });

        res.status(200).json({ message: "Vote counted!", poll: updatedPoll });
    } catch (error) {
        console.error("Error voting:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createPoll, getPolls, votePoll };
