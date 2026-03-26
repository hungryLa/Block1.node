const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

const initDatabase = async (retries = 10, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log('Подключились к базе данных');

            require('../models/User');
            require('../models/Todo');
            console.log('Модели загружены');

            await sequelize.sync({ alter: false });
            console.log('Модели синхранизированы');

            return true;

        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

module.exports = { sequelize, initDatabase };