const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

const sequelize = require('../../config/dbconfig/SequelizeDB');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  api_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  api_token_created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

sequelizePaginate.paginate(User);
module.exports = User
