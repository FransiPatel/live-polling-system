const { Sequelize } = require("sequelize");
const sequelize = require("../constants").sequelize;

const PollModel = require("./Poll");
const PollOptionModel = require("./PollOption");

const Poll = PollModel(sequelize);
const PollOption = PollOptionModel(sequelize);

// Define Associations
Poll.hasMany(PollOption, { foreignKey: "pollId", onDelete: "CASCADE" });
PollOption.belongsTo(Poll, { foreignKey: "pollId" });

module.exports = { Poll, PollOption, sequelize };
