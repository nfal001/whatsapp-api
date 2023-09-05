import express from "express";
import userController from "../../controller/user.controller.js";
import clientController from "../../controller/client.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const user2Router = express.Router();
const user2Route = user2Router.use('/api/v1/clients',authMiddleware)
user2Route.get("/current", userController.get);
user2Route.patch("/current", userController.update);
user2Route.delete("/logout", userController.logout);



export {
    api2Router
}