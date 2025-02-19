import React from "react";

const LiveResults = ({ poll }) => {
    if (!poll) return null;

    // Sort options based on their original order (using their ID)
    const sortedOptions = [...poll.PollOptions].sort((a, b) => a.id - b.id);

    return (
        <div className="live-results-container">
            <h2>Live Results</h2>
            {sortedOptions.map((option) => (
                <div key={option.id} className="result-item">
                    <div className="result-text">{option.text}</div>
                    <span className="vote-count">{option.votes} votes</span>
                </div>
            ))}
        </div>
    );
};

export default LiveResults;
