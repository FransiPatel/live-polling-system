const { Poll, PollOption } = require("../models");
const { emitNewPoll } = require("../sockets/socket");

const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Invalid poll data" });
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

        const pollOption = await PollOption.findByPk(optionId);
        if (!pollOption) {
            return res.status(404).json({ message: "Poll option not found" });
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
