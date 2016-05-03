var logger = require("./logger");

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
