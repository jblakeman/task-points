
function serverFactory() {
    var express = require("express");
    var app = express();

    app.get("/", function(req, res) {
        res.send('root path reached');
    });

    app.get("/tasks", function(req, res) {
        res.send('tasks index');
    });

    app.get("/tasks/:id", function(req, res) {
        res.send("task " + req.params.id + " show page reached");
    });

    app.set("port", process.env.PORT || 3000);
    var listen_port = app.get("port");
    var server = app.listen(listen_port, function() {
        console.log("Server listening on port " + listen_port);
    });
    return server;
}

module.exports = serverFactory;
