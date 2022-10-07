const Sequelize = require("sequelize");
const db = require("../db");

const Comment = db.define("comment", {
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    get: function(){
      return this.getDataValue('createdAt').toLocaleString('en-US');
    }
  }
});

module.exports = Comment;