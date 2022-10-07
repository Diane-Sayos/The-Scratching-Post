const Sequelize = require("sequelize");
const db = require("../db");

const Post = db.define('post', {
    body: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.DATE,
        get: function(){
            return this.getDataValue('createdAt').toLocaleString('en-US');
        }
    }
});

module.exports = Post;
