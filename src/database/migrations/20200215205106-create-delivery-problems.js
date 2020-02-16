module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_problems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'deliveries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('delivery_problems');
  },
};
