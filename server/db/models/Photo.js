const Sequelize = require('sequelize');
const db = require('../db');

const Photo = db.define('photo', {
    photoUrl : {
        type: Sequelize.TEXT
    }
});

module.exports = Photo;