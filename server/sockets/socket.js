const { Poll, PollOption } = require("../models");
const { SOCKET_EVENTS } = require("../constants");

const initSocket = (io) => {
    io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
        // console.log("New client connected:", socket.id);

        await loadPollsFromDB(socket);

        socket.on(SOCKET_EVENTS.JOIN_POLL, (pollId) => {
            socket.join(pollId);
            // console.log(`Client ${socket.id} joined poll room: ${pollId}`);
        });

        socket.on(SOCKET_EVENTS.NEW_VOTE, async ({ pollId, optionId }) => {
            try {
                const pollOption = await PollOption.findByPk(optionId);
                if (!pollOption) return;
        
                await pollOption.increment("votes");
        
                const updatedPoll = await Poll.findOne({
                    where: { id: pollId },
                    include: [{ model: PollOption }],
                });
        
                // console.log("Emitting poll_data for poll:", updatedPoll.id);
                io.to(pollId).emit(SOCKET_EVENTS.POLL_DATA, updatedPoll); // Emit update only to the poll room
            } catch (error) {
                console.error("Error updating vote:", error);
            }
        });
        

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            // console.log("Client disconnected:", socket.id);
        });
    });

    async function loadPollsFromDB(socket) {
        const polls = await Poll.findAll({ include: PollOption });
        polls.forEach((poll) => socket.emit(SOCKET_EVENTS.POLL_DATA, poll));
    }
};

const emitNewPoll = async (io, pollId) => {
    try {
        const newPoll = await Poll.findOne({
            where: { id: pollId },
            include: [{ model: PollOption }],
        });

        if (newPoll) {
            io.emit(SOCKET_EVENTS.NEW_POLL, newPoll);
            // console.log(`New poll emitted: ${newPoll.question}`);
        }
    } catch (error) {
        console.error("Error emitting new poll:", error);
    }
};

module.exports = { initSocket, emitNewPoll };
