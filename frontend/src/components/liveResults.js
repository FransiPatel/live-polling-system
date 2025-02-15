import React from "react";

const LiveResults = ({ poll }) => {
    if (!poll) return null;

    return (
        <div className="live-results-container">
            <h2>Live Results</h2>
            {poll.PollOptions.map((option) => (
                <div key={option.id} className="result-item">
                    <div className="result-text">{option.text}</div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${option.votes * 10}%` }} // Assuming votes percentage (adjust as needed)
                        ></div>
                    </div>
                    <span className="vote-count">{option.votes} votes</span>
                </div>
            ))}
        </div>
    );
};

export default LiveResults;
