const Sequelize = require('sequelize');
const db = require('../db');
//followingId, followerId
const Connection = db.define('connection', {
    isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});
module.exports = Connection;