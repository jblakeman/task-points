function serverFactory() {
    var express     = require("express");
    var controllers = require("./controllers");
    var logger      = require("./logger.js");

    var app = express();

    logger.info("Setting up express...");
    app.use("/public", express.static(__dirname + "/public"));
    logger.info("express configured");

    var rootCtrl  = controllers.rootCtrl;
    var taskCtrl = controllers.taskCtrl;

    app.get("/", rootCtrl);
    app.get("/tasks", taskCtrl.index);
    app.get("/tasks/:id", taskCtrl.show);

    logger.info("Setting up server to listen...");
    app.set("port", process.env.PORT || 3000);
    var listen_port = app.get("port");
    var server = app.listen(listen_port, function() {
        logger.info("Server listening on port " + listen_port);
    });
    return server;
}

module.exports = serverFactory;
