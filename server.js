function serverFactory() {
    var express     = require("express");
    var controllers = require("./controllers");

    var app = express();

    var rootCtrl  = controllers.rootCtrl;
    var taskCtrl = controllers.taskCtrl;

    app.get("/", rootCtrl);
    app.get("/tasks", taskCtrl.index);
    app.get("/tasks/:id", taskCtrl.show);

    app.set("port", process.env.PORT || 3000);
    var listen_port = app.get("port");
    var server = app.listen(listen_port, function() {
        console.log("Server listening on port " + listen_port);
    });
    return server;
}

module.exports = serverFactory;
