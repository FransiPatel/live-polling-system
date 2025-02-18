import React, { useEffect, useState } from "react";

const PollOptions = ({ poll, socket }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        socket.emit("join_poll", poll.id);
        console.log("Joined poll room:", poll.id); // ✅ Debug log
    }, [poll.id]);

    const handleVote = () => {
        if (!selectedOption) {
            alert("Select an option first!");
            return;
        }

        socket.emit("new_vote", { pollId: poll.id, optionId: selectedOption });
        setSelectedOption(null);
    };

    return (
        <div className="poll-container">
            <h3>{poll.question}</h3>
            <div className="poll-options-wrapper">
                {poll.PollOptions.map((option) => (
                    <button
                        key={option.id}
                        className={`poll-option ${selectedOption === option.id ? "selected" : ""}`}
                        onClick={() => setSelectedOption(option.id)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            <button className="vote-button" onClick={handleVote}>Vote</button>
        </div>
    );
};

export default PollOptions;
