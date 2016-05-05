module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable("Tasks", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			body: {
				type: Sequelize.STRING
			},
			estimated_time: {
				type: Sequelize.INTEGER
			},
			points: {
				type: Sequelize.INTEGER
			},
			enjoyment_level: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable("Tasks");
	}
};
