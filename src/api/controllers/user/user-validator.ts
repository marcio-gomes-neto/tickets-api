import * as Joi from "joi";

export const createUserValidator = Joi.object().keys({
    cpf: Joi.string().trim().max(11).required(),
    name: Joi.string().trim().max(100).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    admin: Joi.boolean().required()
}).required();