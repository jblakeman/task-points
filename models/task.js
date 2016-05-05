module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estimated_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        enjoyment_level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        }
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
