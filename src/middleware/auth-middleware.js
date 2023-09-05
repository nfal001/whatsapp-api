import { prismaClient } from "../application/database.js";

/**
 * @type {import("express").RequestHandler} 
 */
export const authMiddleware = async (req, res, next) => {
    const token = req.header("authorization") ?? "";
    const authToken = token.split(" ");
    
    if (!token || authToken[0] !== 'Bearer') {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: authToken[1]
            }
        });

        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
}