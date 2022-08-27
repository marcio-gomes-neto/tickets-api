import * as Joi from "joi";

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const getAllUsersValidator = Joi.object().keys({
    status: Joi.string().valid('active', 'inactive', 'blocked', '')
})

export const blockUserValidator = Joi.object().keys({
    id: Joi.string().trim(),
    cpf: Joi.string().trim().max(11),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
}).or('id', 'cpf', 'email').required()

export const unblockUserValidator = Joi.object().keys({
    id: Joi.string().trim(),
    cpf: Joi.string().trim().max(11),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
}).or('id', 'cpf', 'email').required()