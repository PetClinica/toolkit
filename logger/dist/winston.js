"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = exports.winstonLogger = void 0;
const winston_1 = __importDefault(require("winston"));
function getFormats() {
    const formats = new Array(winston_1.default.format.splat(), winston_1.default.format.timestamp());
    formats.push(process.env.ENV === 'local'
        ? winston_1.default.format.simple()
        : winston_1.default.format.json());
    return formats;
}
exports.winstonLogger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston_1.default.format.combine(...getFormats()),
    transports: [
        new winston_1.default.transports.Console({
            forceConsole: true,
        }),
    ],
});
class WinstonLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    info(msg, ...args) {
        this.logger.info(msg, ...args);
    }
    debug(msg, ...args) {
        this.logger.debug(msg, ...args);
    }
    warn(msg, ...args) {
        this.logger.warn(msg, ...args);
    }
    error(msg, error) {
        this.logger.error(`${msg}: ${error.message}`);
    }
}
exports.WinstonLogger = WinstonLogger;
