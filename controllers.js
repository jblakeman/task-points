var controllers = {
    rootCtrl: function(req, res) {
        res.send({title: "Welcome"});
    },
    taskCtrl: {
        index: function(req, res) {
            res.send({title: "Task Index"});
        },
        show: function(req, res) {
            res.send({
                id: req.params.id,
                title: "Task Show"
            });
        }
    }
};

module.exports = controllers;
