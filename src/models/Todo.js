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
}, {
    tableName: 'todos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
})

User.hasMany(Todo, {
    foreignKey: 'user_id',
    as: 'todos'
})

Todo.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

module.exports = Todo;