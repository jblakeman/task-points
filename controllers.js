function controllers(models, logger) {
    var Task    = models.Task;
    var Tag     = models.Tag;
    var TaskSub = models.sequelize.models.TaskSub;
    var TaskTag = models.sequelize.models.TaskTag;

    var sendFileOpts = {
        root: __dirname + "/public/",
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };
    var getPlain = function(instance) {
        return instance.get({plain: true});
    };
    var ctrls = {};
    ctrls.rootCtrl = function(req, res) {
        var fileName = "index.html";
        logger.info("Responding with " + fileName +
                    " to root get request");
        res.sendFile(fileName, sendFileOpts, function(err) {
            if (err) {
                logger.error(err);
            } else {
                logger.info("Sent: " + fileName);
            }
        });
    };
    ctrls.taskCtrl = {
        setPoints: function(task) {
            if (task.enjoyment > 1) { task.enjoyment *= 0.5; }
            task.points = Math.round(task.enjoyment *
                                     (1 + (task.minutes * 0.5)));
            return task;
        },
        index: function(req, res) {
            // Sequelize doesn't support self associations very well
            // so we do some hackery to find all root tasks (projects)
            var subIds = [];
            logger.info("Building task index...");
            return TaskSub.findAll({}).then(function(tasksubs) {
                logger.info("TaskSubs retrieved...");
                tasksubs.forEach(function(tasksub) {
                    subIds.push(getPlain(tasksub).SubtaskId);
                });
            }).then(function() {
                logger.info("Finding Tasks that aren't Subtasks (roots)");
                Task.findAll({where: {id: {$notIn: subIds}}})
                    .then(function(parents) {
                        res.json(parents);
                    }, function(err) {
                        logger.error("Unable to retrieve root tasks:", err);
                        res.send(400, err);
                    });
            });
        },
        show: function(req, res) {
            // Depth-first search to find all Subtasks
            // of projects, and their children.
            //
            // TODO: Replace this with a raw, postgres CTE query.
            function traverse(nodes) {
                // Start by querying for children (pre-order)
                return node.getSubtasks().then(function(subs) {
                    return {task: node, children: subs};
                }).then(function(t) {
                    var inorders = [];
                    if (t.children.length > 0) {
                        // Traverse all the subtasks if they exist (i-N in-order)
                        t.children.forEach(function(child, i) {
                            orders.push(traverse(child).then(function(children) {
                                t.children[i] = children;
                                return true;
                            }));
                        });
                    }
                    // completes a node traversal (post-order)
                    return Promise.all(orders).then(function() {
                        return t;
                    });
                });
            }
            Task.findById(req.params.id).then(function(task) {
                // Build root task's generic tree using depth-first search
                traverse(task).then(function(tree) {
                    res.json(tree);
                });
            }, function(err) {
                res.send(400, err);
            });
        },
        create: function(req, res) {
            Task.create(this.setPoints(req.body)).then(function(task) {
                res.json(task);
            }, function(err) {
                res.send(400, err);
                throw err;
            });
        },
        update: function(req, res) {
            Task.update(req.body).then(function(task) {
                res.json(task);
            });
        },
        destroy: function(req, res, isHelper) {
            // Sequelize removes all relationships attached to columns
            // when they're destroyed by default (CASCADE).
            Task.findById(req.params.id).then(function(task) {
                task.destroy().then(function() {
                    res.json({sucess: true});
                }, function(err) {
                    res.send(400, err);
                });
            }, function(err) {
                res.send(400, err);
            });
        },
        addSub: function(req, res) {
            Task.create(this.setPoints(req.body)).then(function(task) {
                Task.findById(req.params.id).then(function(parentTask) {
                    parentTask.addSubtask(task).then(function() {
                        res.json(task);
                    }, function(err) {
                        res.send(400, err);
                    });
                }, function(err) {
                    res.send(400, err);
                });
            }, function(err) {
                res.send(400, err);
            });
        }
    };
}

module.exports = controllers(model, logger).ctrls;
