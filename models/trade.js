// Require bcrypt for password hashing
const bcrypt = require("bcryptjs");

// Trade model
module.exports = function (sequelize, DataTypes) {
  const Trade = sequelize.define("Trade", {
    // The email cannot be null, and must be a proper email before creation
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    sendCard: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiveCard: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  });
  return Trade;
};
