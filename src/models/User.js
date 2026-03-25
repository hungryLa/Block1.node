const { DataTypes} = require('sequelize')
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.validatePassword = async function(password){
    return bcrypt.compare(password, this.password);
}

module.exports = User;