const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PollOption = sequelize.define("PollOption", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        votes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: "PollOption",
        timestamps: false,
    });

    return PollOption;
};
