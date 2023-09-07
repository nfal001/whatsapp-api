import userService from "../service/user.service.js"
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        return res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const validated = validate(loginUserValidation, req.body);

        const result = await userService.login(validated);

        return res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.get(username);
        return res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;
        request.username = username;

        const result = await userService.update(request);

        return res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username);
        return res.status(200).json({
            status: true,
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    get,
    update,
    logout
}