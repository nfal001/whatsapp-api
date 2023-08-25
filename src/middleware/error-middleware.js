import config from "../config/config.js";
import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, _req, res, next) => {

    if (!err) {
        next();
        return;
    }

    const msg = config.app.env === 'production' ? 'something went error' : err.message

    if (err instanceof ResponseError) {


        res.status(err.status).json({
            status: false,
            errors: msg
        }).end();
    } else {
        res.status(500).json({
            status: false,
            errors: msg
        }).end();
    }
}

export {
    errorMiddleware
}