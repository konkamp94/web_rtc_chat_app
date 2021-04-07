const { Sequelize } = require('sequelize');

const db = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
});

module.exports = db;