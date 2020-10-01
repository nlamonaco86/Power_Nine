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
    senderName: {
      type: DataTypes.STRING,
      default: null,
    },
    receiverID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverName: {
      type: DataTypes.STRING,
      default: null,
    },
    message: {
      type: DataTypes.STRING,
      default: null,
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
