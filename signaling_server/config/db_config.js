const { Sequelize } = require('sequelize');

const db = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'db',
    port: 5432,
    dialect: 'postgres'
});

module.exports = db;