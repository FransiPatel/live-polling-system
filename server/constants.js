require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Sequelize } = require("sequelize");

// Database Configuration
const DB_CONFIG = {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    options: {
        dialect: "postgres",
        logging: false,
    }
};

// Server Configuration
const SERVER_CONFIG = {
    PORT: process.env.PORT || 3000,
    CORS_OPTIONS: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};

// Socket Events
const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NEW_VOTE: 'new_vote',
    POLL_CREATED: 'poll_created',
    POLL_DATA: 'poll_data',
    NEW_POLL: 'new_poll',
    JOIN_POLL: 'join_poll'
};

// Database Connection
const sequelize = new Sequelize(
    DB_CONFIG.name, 
    DB_CONFIG.user, 
    DB_CONFIG.password, 
    {
        host: DB_CONFIG.host,
        ...DB_CONFIG.options
    }
);

// Test Database Connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

// Create instances of required packages
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: SERVER_CONFIG.CORS_OPTIONS
});

module.exports = {
    // Packages
    express,
    cors,
    
    // Configurations
    DB_CONFIG,
    SERVER_CONFIG,
    SOCKET_EVENTS,
    
    // Instances
    app,
    server,
    io,
    sequelize
};
