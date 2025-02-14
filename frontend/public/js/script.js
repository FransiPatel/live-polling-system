const socket = io("http://localhost:5000"); // Connect to backend server
const pollList = document.getElementById("poll-list");

// Fetch Polls from Backend
const fetchPolls = async () => {
    try {
        const response = await fetch("http://localhost:5000/polls");
        const data = await response.json();
        displayPolls(data.polls);
    } catch (error) {
        console.error("Error fetching polls:", error);
    }
};

// Display Polls
const displayPolls = (polls) => {
    pollList.innerHTML = ""; // Clear previous polls
    polls.forEach(poll => {
        const pollDiv = document.createElement("div");
        pollDiv.classList.add("poll");
        pollDiv.innerHTML = `
            <h3>${poll.question}</h3>
            ${poll.PollOptions.map(option => `
                <button onclick="vote('${option.id}')">${option.text} (${option.votes})</button>
            `).join("")}
        `;
        pollList.appendChild(pollDiv);
    });
};

// Create Poll
const createPoll = async () => {
    const question = document.getElementById("poll-question").value;
    const option1 = document.getElementById("option1").value;
    const option2 = document.getElementById("option2").value;

    if (!question || !option1 || !option2) {
        alert("Please enter a question and at least two options!");
        return;
    }

    try {
        await fetch("http://localhost:5000/polls/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, options: [option1, option2] })
        });

        fetchPolls(); // Refresh polls
    } catch (error) {
        console.error("Error creating poll:", error);
    }
};

// Vote on a Poll
const vote = async (optionId) => {
    try {
        await fetch("http://localhost:5000/polls/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ optionId })
        });
    } catch (error) {
        console.error("Error voting:", error);
    }
};

// Listen for Real-time Vote Updates
socket.on("new_vote", (updatedPoll) => {
    fetchPolls(); // Refresh polls when a vote is updated
});

// Initial Fetch
fetchPolls();
