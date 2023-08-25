import express from "express";
import { publicRouter } from "../route/public-route.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { clientRouter, userRouter } from "../route/api.js";

globalThis.WAClientInstanceManager = {
    stampWACLIENTMANAGERINIT: 'ini adalah WAClientInstanceManager'
}

export const web = express();

web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(clientRouter);
web.use(errorMiddleware);