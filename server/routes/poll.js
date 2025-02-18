const { express } = require("../constants");
const { createPoll, getPolls, votePoll } = require("../controllers/pollController");

const router = express.Router();

// Routes
router.post("/create", createPoll);
router.get("/", getPolls);
router.post("/vote", votePoll);

module.exports = router;
