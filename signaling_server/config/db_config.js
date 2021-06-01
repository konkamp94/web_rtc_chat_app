const { Sequelize } = require('sequelize');

const db = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'postgres-web-rtc',
    port: 5432,
    dialect: 'postgres'
});

module.exports = db;