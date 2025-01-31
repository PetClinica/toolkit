"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = getLogger;
exports.setLogger = setLogger;
class DefaultLogger {
    info(msg, ...args) {
        console.info(msg, ...args);
    }
    debug(msg, ...args) {
        console.debug(msg, ...args);
    }
    warn(msg, ...args) {
        console.warn(msg, ...args);
    }
    error(msg, error) {
        console.error(msg, error);
    }
}
let logger = new DefaultLogger();
function getLogger() {
    return logger;
}
function setLogger(newLogger) {
    logger = newLogger;
}
