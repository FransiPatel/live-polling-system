import React, { useState } from "react";

const CreatePoll = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const addOption = () => setOptions([...options, ""]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (question.trim() === "" || options.filter((opt) => opt.trim()).length < 2) {
            alert("Please enter a question and at least two options.");
            return;
        }
    
        const response = await fetch("http://localhost:3000/polls/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, options }),
        });
    
        if (response.ok) {
            setQuestion("");
            setOptions(["", ""]);
        } else {
            alert("Error creating poll.");
        }
    };

    return (
        <div className="create-poll-container">
            <h2>Create a Poll</h2>
            <form onSubmit={handleSubmit} className="create-poll-form">
                <input
                    type="text"
                    className="poll-question-input"
                    placeholder="Enter poll question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />
                <div className="poll-options-container">
                    {options.map((opt, index) => (
                        <input
                            key={index}
                            type="text"
                            className="poll-option-input"
                            placeholder={`Option ${index + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                        />
                    ))}
                </div>
                <button type="button" className="add-option-btn" onClick={addOption}>+ Add Option</button>
                <button type="submit" className="create-poll-btn">Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePoll;
