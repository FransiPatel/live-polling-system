import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CreatePoll from "./components/CreatePoll";
import PollList from "./components/PollList";
import PollOptions from "./components/PollOptions";
import LiveResults from "./components/LiveResults";

const socket = io("http://localhost:3000");

const App = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);

    useEffect(() => {
        fetchPolls();
        socket.on("poll_data", (updatedPoll) => {
            setPolls((prevPolls) =>
                prevPolls.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
            );
        });

        socket.on("new_poll", (poll) => {
            setPolls((prevPolls) => [...prevPolls, poll]);
        });

        return () => {
            socket.off("poll_data");
            socket.off("new_poll");
        };
    }, []);

    const fetchPolls = async () => {
        const response = await fetch("http://localhost:3000/polls");
        const data = await response.json();
        setPolls(data.polls);
    };

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
            <h1>Live Polling System</h1>
            <CreatePoll fetchPolls={fetchPolls} />
            <PollList polls={polls} setSelectedPoll={setSelectedPoll} />
            {selectedPoll && <PollOptions poll={selectedPoll} socket={socket} />}
            <LiveResults poll={selectedPoll} />
        </div>
    );
};

export default App;
