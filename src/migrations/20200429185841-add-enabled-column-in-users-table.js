  'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'enabled',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      {
        after: 'updated_at'                                  // after option is only supported by MySQL
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'enabled');
  }
};
