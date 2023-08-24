import Joi from "joi";

const createClientValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const getClientByNameValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const sendMessageValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    target_number: Joi.string().required(),
    text_message: Joi.string().required()
});

export {
    createClientValidation,
    getClientByNameValidation,
    sendMessageValidation
}