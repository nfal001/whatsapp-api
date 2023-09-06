import { ResponseError } from "../error/response-error.js";

/**
 * 
 * @param {import("joi").Schema} schema 
 * @param {object} request 
 * @returns 
 */
const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    });
    if (result.error){
        // console.log(result.error.details);
        throw new ResponseError(400,result.error.message, result.error.details);
    } else {
        return result.value;
    }
}

export {
    validate
}