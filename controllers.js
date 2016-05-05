var logger = require("./logger");
var models = require("./models");
var Task   = models.Task;
var Tag    = models.Tag;

var sendFileOpts = {
    root: __dirname + "/public/",
    dotfiles: "deny",
    headers: {
        "x-timestamp": Date.now(),
        "x-sent": true
    }
};

var controllers = {
    rootCtrl: function(req, res) {
        var fileName = "index.html";
        logger.info("Responding with " + fileName + " to root get request");
        res.sendFile(fileName, sendFileOpts, function(err) {
            if (err) {
                logger.error(err);
            } else {
                logger.info("Sent: " + fileName);
            }
        });
    },
    taskCtrl: {
        calcPoints: function(minutes, enjoyment) {
            if (enjoyment > 1) { enjoyment *= 0.5; }
            return Math.round(enjoyment * (1 + (minutes * 0.5)));
        },
        index: function(req, res) {
            res.send({title: "Task Index"});
        },
        show: function(req, res) {
            res.send({
                id: req.params.id,
                title: "Task Show"
            });
        },
        create: function(req, res) {
            var newTask = req.params.body;
            Task.create(newTask).then(function(task) {
                Task.update({
                    points: calcPoints(newTask.estimated_time,
                                       newTask.enjoyment_level)
                }).then(function(task) {
                    res.json(task);
                }, function(err) {
                    res.json(422, err);
                });
            });
        },
        update: function(req, res) {
            Task.update(req.params.body).then(function(task) {
                res.json(task);
            });
        },
        destroy: function(req, res) {
            Task.destroy(res.params.body).then(function() {
                res.json({sucess: true});
            });
        }

    }
};

module.exports = controllers;
