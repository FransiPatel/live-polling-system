import React, { useState } from "react";

const PollOptions = ({ poll, socket }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleVote = () => {
        if (!selectedOption) {
            alert("Select an option first!");
            return;
        }
        socket.emit("new_vote", { pollId: poll.id, optionId: selectedOption });
    };

    return (
        <div>
            <h3>{poll.question}</h3>
            {poll.PollOptions.map((option) => (
                <label key={option.id} style={{ display: "block", margin: "10px" }}>
                    <input type="radio" name="pollOption" value={option.id} onChange={() => setSelectedOption(option.id)} />
                    {option.text}
                </label>
            ))}
            <button onClick={handleVote}>Vote</button>
        </div>
    );
};

export default PollOptions;
