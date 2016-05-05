module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define('Task', {
        body: DataTypes.STRING,
        estimated_time: DataTypes.INTEGER,
        points: DataTypes.INTEGER,
        enjoyment_level: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Task.belongsToMany(Task, {as: "Subtasks", through: "TaskSub"});
                Task.belongsToMany(models.Tag, {through: "TaskTag"});
            }
        }
    });
    return Task;
};
