'use strict';
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
  class User extends Model {}
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'invalid email format'
        },
        notEmpty: {
          args: true,
          msg: 'email is a required field'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 6,
          msg: 'password minimum 6 char'
        },
        notEmpty: {
          args: true,
          msg: 'email is a required field'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user,opt) => {
        user.password = hashPassword(user.password)
      }
    }
  })
  
  return User;
};