const { app, server, io, SERVER_CONFIG, sequelize, cors, express } = require("./constants");
const pollRoutes = require("./routes/poll");
const { initSocket } = require("./sockets/socket");

// Middleware
app.use(cors());
app.use(express.json());

// Initialize socket
initSocket(io);

// Routes
app.use("/polls", pollRoutes);

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
