const { DataTypes} = require('sequelize')
const { sequelize } = require('../config/database');
const User = require('./User');
const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        referer: {
            model: User,
            key: 'id',
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
    }
})

User.hasMany(Todo, {
    foreignKey: 'user_id',
})

Todo.belongsTo(User, {
    foreignKey: 'user_id',
})

module.exports = Todo;