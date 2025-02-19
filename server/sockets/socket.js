const { Poll, PollOption } = require("../models");
const { SOCKET_EVENTS } = require("../constants");

let ioInstance;

const initSocket = (io) => {
    ioInstance = io;
    io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
        // console.log('Client connected');
        // Send initial polls when client connects
        const polls = await Poll.findAll({ include: PollOption });
        socket.emit(SOCKET_EVENTS.POLL_DATA, polls);
    });
};

const emitNewPoll = async (pollId) => {
    try {
        const newPoll = await Poll.findOne({
            where: { id: pollId },
            include: [{ model: PollOption }],
        });

        if (newPoll && ioInstance) {
            ioInstance.emit(SOCKET_EVENTS.NEW_POLL, newPoll);
        }
    } catch (error) {
        console.error("Error emitting new poll:", error);
    }
};

const emitUpdatedPoll = async (pollId) => {
    try {
        const updatedPoll = await Poll.findOne({
            where: { id: pollId },
            include: [{ model: PollOption }],
        });

        if (updatedPoll && ioInstance) {
            ioInstance.emit(SOCKET_EVENTS.POLL_DATA, updatedPoll);
        }
    } catch (error) {
        console.error("Error emitting updated poll:", error);
    }
};

module.exports = { initSocket, emitNewPoll, emitUpdatedPoll };
