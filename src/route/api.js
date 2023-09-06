import express from "express";
import userController from "../controller/user.controller.js";
import clientController from "../controller/client.controller.js";
import testController from '../controller/test.controller.js';
import { authMiddleware } from "../middleware/auth-middleware.js";

// route user set
const userRouterSet = express.Router();
userRouterSet.get("/current", userController.get);
userRouterSet.patch("/current", userController.update);
userRouterSet.delete("/logout", userController.logout);

// wrap route user set
const userRouter = express.Router();
userRouter.use('/api/users', authMiddleware, userRouterSet);

// route client set
const clientRouterSet = express.Router();
clientRouterSet.get("/", clientController.getAllClient);
clientRouterSet.post("/", clientController.createNewClient);
clientRouterSet.get("/profile/:client_name", clientController.getClientByName);
clientRouterSet.get("/qr", clientController.getQRCode);
clientRouterSet.post("/sendmessage", clientController.sendMessage);
clientRouterSet.post("/init", clientController.initializeClient);
clientRouterSet.post("/state", clientController.getClientState);
clientRouterSet.post("/sendmedia", clientController.sendMedia);
clientRouterSet.post("/sendbutton", clientController.sendButton);
clientRouterSet.post("/setclientstatus", clientController.setClientStatus);
clientRouterSet.get("/getuserpicture", clientController.getUserPicture);
clientRouterSet.delete("/destroy", clientController.destroyClientSession);

// wrap route client set
const clientRouter = express.Router()
clientRouter.use('/api/clients',authMiddleware,clientRouterSet)



export {
    userRouter,
    clientRouter,
}