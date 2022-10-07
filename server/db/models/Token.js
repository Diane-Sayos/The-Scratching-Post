const db = require('../db');
const Sequelize = require('sequelize');

const Token = db.define('token', {
  userId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    expires: 3600
  }
});

module.exports = Token;