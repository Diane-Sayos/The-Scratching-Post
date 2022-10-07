const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
      type: Sequelize.DATE,
      get: function(){
          //not sure if I can put a getter on createdAt but below just add a format for output of date
          return this.getDataValue('createdAt').toLocaleString('en-US');
      }
  }
});

module.exports = Message;