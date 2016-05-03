var winston = require("winston");

winston.emitErrs = true;

var fileOptions = {
    level: "info",
    filename: "./logs/server-logs.log",
    handleExceptions: true,
    json: true,
    maxsize: 6291456,
    maxFiles: 4,
};

var consoleOptions = {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
};

var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)(fileOptions),
        new (winston.transports.Console)(consoleOptions)
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message) {
        logger.info(message);
    }
};
