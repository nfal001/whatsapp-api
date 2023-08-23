import winston from "winston";
import config from '../config/config.js'

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({})
    ]
});

const logEmitter = {
    info: (e) => {
        config.app.DebugMode ? logger.info(e) : ''
    },
    warn: (e) => {
        config.app.DebugMode ? logger.warn(e) : ''
    },
    error: (e) => {
        config.app.DebugMode ? logger.error(e) : ''
    }
}

export {
    logger, logEmitter
}