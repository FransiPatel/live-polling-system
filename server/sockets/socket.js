const { Poll, PollOption } = require("../models");

const initSocket = (io) => {
    io.on("connection", async (socket) => {
        // console.log("New client connected:", socket.id);

        await loadPollsFromDB(socket);

        socket.on("join_poll", (pollId) => {
            socket.join(pollId);
            // console.log(`Client ${socket.id} joined poll room: ${pollId}`);
        });

        socket.on("new_vote", async ({ pollId, optionId }) => {
            try {
                const pollOption = await PollOption.findByPk(optionId);
                if (!pollOption) return;
        
                await pollOption.increment("votes");
        
                const updatedPoll = await Poll.findOne({
                    where: { id: pollId },
                    include: [{ model: PollOption }],
                });
        
                // console.log("Emitting poll_data for poll:", updatedPoll.id);
                io.to(pollId).emit("poll_data", updatedPoll); // Emit update only to the poll room
            } catch (error) {
                console.error("Error updating vote:", error);
            }
        });
        

        socket.on("disconnect", () => {
            // console.log("Client disconnected:", socket.id);
        });
    });

    async function loadPollsFromDB(socket) {
        const polls = await Poll.findAll({ include: PollOption });
        polls.forEach((poll) => socket.emit("poll_data", poll));
    }
};

const emitNewPoll = async (io, pollId) => {
    try {
        const newPoll = await Poll.findOne({
            where: { id: pollId },
            include: [{ model: PollOption }],
        });

        if (newPoll) {
            io.emit("new_poll", newPoll);
            // console.log(`New poll emitted: ${newPoll.question}`);
        }
    } catch (error) {
        console.error("Error emitting new poll:", error);
    }
};

module.exports = { initSocket, emitNewPoll };
