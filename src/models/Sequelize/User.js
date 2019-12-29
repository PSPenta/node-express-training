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
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
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
  }
});

sequelizePaginate.paginate(User);
module.exports = User
