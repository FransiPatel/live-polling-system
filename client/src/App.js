import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CreatePoll from "./components/createPoll";
import PollList from "./components/pollList";
import PollOptions from "./components/pollOptions";
import LiveResults from "./components/liveResults";

const socket = io("http://localhost:3000");

const App = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);

    // Only socket event listeners
    useEffect(() => {
        // Listen for initial and updated polls
        socket.on("poll_data", (data) => {
            // If data is an array, it's initial polls
            if (Array.isArray(data)) {
                setPolls(data);
            } else {
                // If data is a single poll, it's an update
                setPolls((prevPolls) =>
                    prevPolls.map((poll) => 
                        poll.id === data.id ? data : poll
                    )
                );
                
                setSelectedPoll((prevSelected) =>
                    prevSelected && prevSelected.id === data.id 
                        ? data 
                        : prevSelected
                );
            }
        });
    
        // Listen for new polls
        socket.on("new_poll", (poll) => {
            setPolls((prevPolls) => [...prevPolls, poll]);
        });
    
        return () => {
            socket.off("poll_data");
            socket.off("new_poll");
        };
    }, []);    

    return (
        <div className="app">
            <h1>Live Polling System</h1>
            <CreatePoll />
            <PollList polls={polls} setSelectedPoll={setSelectedPoll} />
            {selectedPoll && <PollOptions poll={selectedPoll} />}
            <LiveResults poll={selectedPoll} />
        </div>
    );
};

export default App;
