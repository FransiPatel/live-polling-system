import React from "react";

const LiveResults = ({ poll }) => {
    if (!poll) return null;

    return (
        <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block", background: "white", padding: "15px", borderRadius: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
            <h2>Live Results</h2>
            {poll.PollOptions.map((option) => (
                <div key={option.id} className="result-item">
                    {option.text}: <span className="vote-count">{option.votes}</span> votes
                </div>
            ))}
        </div>
    );
};

export default LiveResults;
