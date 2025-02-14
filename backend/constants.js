const { Sequelize } = require("sequelize");
require("dotenv").config();

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

module.exports = { 
    sequelize, 
    SERVER_CONFIG, 
    SOCKET_EVENTS 
};
