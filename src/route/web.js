import express from "express";
import userController from "../controller/user.controller.js";

const webRouter = express.Router();

webRouter.set('view engine','eta')
webRouter.get('/web/hello', (req,res)=>{
    res.end('web interface','ascii')
})
export { webRouter };
