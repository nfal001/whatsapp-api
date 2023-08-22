import Joi from "joi";

const createClientValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const getClientByNameValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

export {
    createClientValidation,
    getClientByNameValidation
}