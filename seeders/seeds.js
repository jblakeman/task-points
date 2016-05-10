var models = require("../models");

function logTask(task) {
    console.log("Task added with body:", task.body,
                "| estimated_time:", task.estimated_time,
                "| enjoyment_level:", task.enjoyment_level,
                "| points:", task.points);
}

models.sequelize.sync().then(function() {
    var Task    = models.Task;
    var Tag     = models.Tag;
    var TaskSub = models.sequelize.models.TaskSub;
    var TaskTag = models.sequelize.models.TaskTag;
    var hour = 3600;
    console.log(models.sequelize.models.TaskSub);
    function setPoints(instance) {
        if (instance.enjoyment_level > 1) {
            instance.enjoyment_level *= 0.5;
        }
        instance.points = Math.round(instance.enjoyment_level *
                                     (1 + (instance.estimated_time * 0.06)));
        return instance;
    }
    var destroyAlls = [
        Task.destroy({where: {}}),
        TaskSub.destroy({where: {}}),
        Tag.destroy({where: {}}),
        TaskTag.destroy({where: {}})
    ];
    var taskSeeds = [{
            body: "Example master",
            estimated_time: hour,
            enjoyment_level: 1
        }, {
            body: "Make a functional, positive reinforcement based ToDo app",
            estimated_time: hour * 60,
            enjoyment_level: 1
        }, {
            body: "Add User Stories / plan functionality",
            estimated_time: hour,
            enjoyment_level: 1
        }, {
            body: "Map out ERD",
            estimated_time: hour * 2,
            enjoyment_level: 2
        }, {
            body: "Evaluate options and decide on stack",
            estimated_time: hour * 1.5,
            enjoyment_level: 2
        }, {
            body: "define backend package dependencies/config files",
            estimated_time: hour * 1.5,
            enjoyment_level: 2
        }, {
            body: "Define backend routes/handlers, testing/logging",
            estimated_time: hour * 3,
            enjoyment_level: 2
        }, {
            body: "Template views, wireframe for user stories",
            estimated_time: hour * 3,
            enjoyment_level: 3
        }
    ];
    taskSeeds.forEach(function(seed, index, seeds) {
        seeds[index] = setPoints(seed);
    });

    var master0, child2, child3;
    Promise.all(destroyAlls).then(function() {
        Task.bulkCreate(taskSeeds, {returning: true}).then(function(tasks) {
            console.log("Tasks:", JSON.stringify(tasks));
            var subtasks = tasks.slice(2, tasks.length);
            console.log("Master task:", tasks[1].get({plain: true}));
            master0 = tasks[0];
            master1 = tasks[1];
            return master1.setSubtasks(subtasks).then(function(associated) {
                var sum = 0;
                subtasks.forEach(function(task, index) {
                    if (index === 1) {
                        child2 = task;
                    } else if (index === 2) {
                        child3 = task;
                    }
                    console.log("Subtask", index, ":",
                                task.get({plain: true}));
                    sum += task.points;
                });
                console.log("Task: \"" + tasks[1].body + "\"\n\tpoints:",
                            tasks[1].points + "\n\tsubtasks:",
                            JSON.stringify(subtasks) + "\n\tassociations:",
                            JSON.stringify(associated),
                            "\n\ttotal of subtask points:", sum);
                return true;
            });
        }).then(function() {
            return master1.getSubtasks()
                       .then(function(subs) {
                            return subs;
                        });
        }).then(function(subs) {
            master1 = master1.get({plain: true});
            master1.subs = subs.map(function(sub) {
                sub = sub.get({plain: true});
                return sub;
            });
            console.log("Master task children:", master1.subs);
        }).then(function() {
            var firstGrand = {
                body: "Weigh relational vs. non-relational DBs",
                estimated_time: hour * 0.5,
                enjoyment_level: 1
            };
            var greatGrand = {
                body: "Documents/queries/scaling vs. " +
                      "Relationships/updates/optimization",
                estimated_time: hour * 0.25,
                enjoyment_level: 1
            };
            firstGrand = setPoints(firstGrand);
            greatGrand = setPoints(greatGrand);
            // Add some descendants
            Task.create(firstGrand).then(function(task) {
                child3.addSubtask(task).then(function(grand) {
                    console.log("firstGrand:", grand[0][0].get({plain: true}));
                    Task.create(greatGrand).then(function(great) {
                        task.addSubtask(great).then(function() {
                            console.log("greatGrand:", JSON.stringify(great, null, 2));
                        });
                    });
                });
            });
        });
    });
});
