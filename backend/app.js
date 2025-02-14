const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { SERVER_CONFIG } = require("./constants");
const { sequelize } = require("./constants"); // Ensure DB connection is imported
const pollRoutes = require("./routes/poll");
const initSocket = require("./sockets/socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/polls", pollRoutes);

// Initialize WebSockets
initSocket(io);

// Sync Database
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully!");
    } catch (error) {
        console.error("Database synchronization failed:", error);
    }
})();

// Start Server
server.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Server running on port ${SERVER_CONFIG.PORT}`);
});
