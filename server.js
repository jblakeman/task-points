function serverFactory() {
    var express     = require("express");
    var app         = express();
    var bodyParser  = require("body-parser");
    var models      = require("./models");
    var logger      = require("./logger.js");
    var controllers = require("./controllers")(models, logger);
    var rootCtrl    = controllers.rootCtrl;
    var taskCtrl    = controllers.taskCtrl;

    logger.info("Setting up express...");
    app.use("/public", express.static(__dirname + "/public"));
    app.use(bodyParser.json());
    logger.info("express configured");

    app.get("/", rootCtrl);
    app.get("/api/tasks", taskCtrl.index);
    app.get("/api/tasks/:id", taskCtrl.show);
    app.post("/api/tasks", taskCtrl.create);
    app.put("/api/tasks/:id", taskCtrl.update);
    app.delete("/api/tasks/:id", taskCtrl.destroy);
    app.post("/api/tasks/:id", taskCtrl.addSub);

    logger.info("Setting up server to listen...");
    app.set("port", process.env.PORT || 3000);
    var listen_port = app.get("port");
    var server = app.listen(listen_port, function() {
        logger.info("Server listening on port " + listen_port);
    });
    return server;
}

module.exports = serverFactory;
