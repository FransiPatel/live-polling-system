require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Sequelize } = require("sequelize");

// Database Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
});

// Test Database Connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

// App Constants
const SERVER_CONFIG = {
    PORT: process.env.PORT || 3000,
};

const SOCKET_EVENTS = {
    NEW_VOTE: "new_vote",
    POLL_CREATED: "poll_created"
};

// Create instances of required packages
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Export everything from constants
module.exports = { 
    app,
    server,
    io,
    sequelize, 
    SERVER_CONFIG, 
    SOCKET_EVENTS, 
    cors,
    express 
};
