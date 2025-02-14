import React from "react";

const PollList = ({ polls, setSelectedPoll }) => {
    return (
        <div>
            <h2>Available Polls</h2>
            <select onChange={(e) => setSelectedPoll(polls.find(poll => poll.id === e.target.value))}>
                <option value="">Select a poll</option>
                {polls.map((poll) => (
                    <option key={poll.id} value={poll.id}>
                        {poll.question}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PollList;
