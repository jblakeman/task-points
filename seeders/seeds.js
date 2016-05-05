var models = require("../models");

function logTask(task) {
    console.log("Task added with body:", task.body,
                "| estimated_time:", task.estimated_time,
                "| enjoyment_level:", task.enjoyment_level,
                "| points:", task.points);
}

models.sequelize.sync().then(function() {
    var Task   = models.Task;
    var Tag    = models.Tag;
    var hour = 3600;
    var web_app;
    console.log(Task.associations.Subtasks.accessors);
    function getPoints(minutes, enjoyment) {
        if (enjoyment > 1) { enjoyment *= 0.5; }
        return Math.round(enjoyment * (1 + (minutes * 0.06)));
    }
    var taskSeeds = [{
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
        seeds[index].points = getPoints(seed.estimated_time, seed.enjoyment_level);
    });
    Task.bulkCreate(taskSeeds, {returning: true}).then(function(tasks) {
        var subtasks = tasks.slice(1, tasks.length);
        console.log("tasks:", JSON.stringify(subtasks));
        return tasks[0].setSubtasks(subtasks).then(function(associated) {
            var sum = 0;
            subtasks.forEach(function(task) {
                sum += task.points;
            });
            console.log("Task:", tasks[0].body, "with points:", tasks[0].points,
                        "has subtasks:", JSON.stringify(associated),
                        "with a total of", sum, "points");
        });
    }).then(function() {console.log("finished"); });
});
