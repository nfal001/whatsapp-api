import express from "express";
import userController from "../controller/user.controller.js";
import clientController from "../controller/client.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

const clientRouter = new express.Router();
clientRouter.use(authMiddleware);
clientRouter.post("/api/clients", clientController.createNewClient);
clientRouter.get("/api/clients/:client_name", clientController.getClientByName);
clientRouter.get("/api/clients", clientController.getAllClient);
clientRouter.post("/api/clients/sendmessage", clientController.sendMessage);
clientRouter.post("/api/clients/init", clientController.initializeClient);



export {
    userRouter,
    clientRouter
}