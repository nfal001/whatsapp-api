import express from "express";
import userController from "../controller/user.controller.js";
import clientController from "../controller/client.controller.js";
import testController from '../controller/test.controller.js';
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
const userRoute = userRouter.use('/api/users', authMiddleware);
userRoute.get("/current", userController.get);
userRoute.patch("/current", userController.update);
userRoute.delete("/logout", userController.logout);

const clientRouter = express.Router();
const clientRoute = clientRouter.use('/api/clients', authMiddleware);
clientRoute.use('/api/clients', authMiddleware);
clientRoute.get("/", clientController.getAllClient);
clientRoute.post("/", clientController.createNewClient);
clientRoute.get("/profile/:client_name", clientController.getClientByName);
clientRoute.get("/qr", clientController.getQRCode);
clientRoute.post("/sendmessage", clientController.sendMessage);
clientRoute.post("/init", clientController.initializeClient);
clientRoute.post("/state", clientController.getClientState);
clientRoute.post("/sendmedia", clientController.sendMedia);
clientRoute.post("/sendbutton", clientController.sendButton);
clientRoute.post("/setclientstatus", clientController.setClientStatus);
clientRoute.get("/getuserpicture", clientController.getUserPicture);


const clientsRouter = express.Router()
// const clientsRoute = clientsRouter.use('/api/client')

clientsRouter.get('/api/client', (_req, res) => {
    res.end('client', 'ascii')
})
clientsRouter.get('/api/client/:client_id', (req, res) => {
    res.end(`clientID: ${req.params.client_id}`, 'ascii')
})

const testRouter = express.Router();
testRouter.get('/api/v1/test', testController.securityTest);


export {
    userRouter,
    clientRouter,
    testRouter
}