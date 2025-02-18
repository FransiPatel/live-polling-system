const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Poll = sequelize.define("Poll", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "Poll",
        timestamps: true
    });

    return Poll;
};
