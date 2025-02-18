import React from "react";

const PollList = ({ polls, setSelectedPoll }) => {
    return (
        <div className="poll-list-container">
            <h2>Available Polls</h2>
            <div className="poll-cards">
                {polls.map((poll) => (
                    <div 
                        key={poll.id} 
                        className="poll-card" 
                        onClick={() => setSelectedPoll(poll)}
                    >
                        <h4>{poll.question}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollList;
