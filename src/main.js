import 'dotenv/config'
import { logger } from "./application/logging.js"
import { web } from "./application/web.js"
import config from '../src/config/config.js';

web.disable('x-powered-by')

web.listen(config.app.port, () => {
    logger.info("App Start");
    console.log("Listening to 127.0.0.1:" + config.app.port);
});
