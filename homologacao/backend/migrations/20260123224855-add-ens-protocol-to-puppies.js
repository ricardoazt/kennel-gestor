'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Puppies', 'ens_protocol', {
      type: Sequelize.JSONB,
      defaultValue: {},
      allowNull: true,
      comment: 'Early Neurological Stimulation protocol tracking (days 3-16)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Puppies', 'ens_protocol');
  }
};
