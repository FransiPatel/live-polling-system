import React, { useEffect, useState } from "react";

const PollOptions = ({ poll, socket }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        socket.emit("join_poll", poll.id);
    }, [poll.id]);

    const handleVote = async () => {
        if (!selectedOption) {
            alert("Select an option first!");
            return;
        }

        try {
            setIsVoting(true);
            
            const response = await fetch("http://localhost:3000/polls/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optionId: selectedOption }),
            });

            if (response.ok) {
                setSelectedOption(null);
            } else {
                alert("Error submitting vote.");
            }
        } catch (error) {
            console.error("Error voting:", error);
            alert("Error submitting vote.");
        } finally {
            setIsVoting(false);
        }
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
                        disabled={isVoting}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            <button 
                className="vote-button" 
                onClick={handleVote}
                disabled={isVoting || !selectedOption}
            >
                {isVoting ? "Voting..." : "Vote"}
            </button>
        </div>
    );
};

export default PollOptions;
