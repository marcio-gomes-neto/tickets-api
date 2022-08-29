import * as Joi from "joi";

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const findOrderValidator = Joi.object().keys({
    id: Joi.string().guid().required()
}).required();

export const payOrderValidator = Joi.object().keys({
    type: Joi.string().trim().required(),
    paymentOptions: Joi.string()
}).required();