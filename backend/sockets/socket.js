const { Poll, PollOption } = require("../models"); // Import models
const { SOCKET_EVENTS } = require("../constants");

/* Initialize WebSocket connections */
const initSocket = (io) => {
    io.on("connection", async (socket) => {
        console.log("New client connected:", socket.id);

        // Load polls on connection
        await loadPollsFromDB(socket);

        // Handle joining a poll room
        socket.on("join_poll", (pollId) => {
            socket.join(pollId);
            console.log(`Client ${socket.id} joined poll room: ${pollId}`);
        });

        // Handle voting via WebSocket
        socket.on("new_vote", async ({ pollId, optionId }) => {
            try {
                // Find option and increment vote count in database
                const pollOption = await PollOption.findByPk(optionId);
                if (!pollOption) return;

                await pollOption.increment("votes");

                // Fetch updated poll results from the database
                const updatedPoll = await Poll.findOne({
                    where: { id: pollId },
                    include: [{ model: PollOption }],
                });

                // Emit updated results to all clients in the poll room
                io.to(pollId).emit("poll_data", {
                    id: updatedPoll.id,
                    PollOptions: updatedPoll.PollOptions.map((opt) => ({
                        id: opt.id,
                        text: opt.text,
                        votes: opt.votes,
                    })),
                });

                console.log(`Vote added to option ${optionId} in poll ${pollId}`);
            } catch (error) {
                console.error("Error updating vote:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    // Load Polls Initially from DB
    async function loadPollsFromDB(socket) {
        const dbPolls = await Poll.findAll({ include: PollOption });
        dbPolls.forEach((poll) => {
            socket.emit("poll_data", {
                id: poll.id,
                PollOptions: poll.PollOptions.map((opt) => ({
                    id: opt.id,
                    text: opt.text,
                    votes: opt.votes || 0,
                })),
            });
        });
    }
};

module.exports = initSocket;
