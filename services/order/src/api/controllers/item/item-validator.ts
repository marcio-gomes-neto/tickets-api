import * as Joi from "joi";

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const AddItemValidator = Joi.object().keys({
    id: Joi.string().guid().required(),
    quantity: Joi.number().integer().min(1).required()
}).required();

export const RemoveItemValidator = Joi.object().keys({
    id: Joi.string().guid().required(),
    quantity: Joi.number().integer().min(1).required()
}).required();