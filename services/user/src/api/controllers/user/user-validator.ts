import * as Joi from "joi";

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const optionalJwtValidator = Joi.object().keys({
    authorization: Joi.string(),
}).unknown();

export const createUserValidator = Joi.object().keys({
    cpf: Joi.string().trim().max(11).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().trim().min(8).max(20).required(),
    confirmPassword: Joi.string().trim().min(8).max(20).required(),
    name: Joi.string().trim().max(100).required(),
    phone: Joi.string().trim().max(50).required(),
    admin: Joi.boolean().required()
}).required();

export const loginUserValidator = Joi.object().keys({
    cpf: Joi.string().trim().max(11),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().trim().min(8).max(20).required()
}).or('cpf', 'email').required();

export const validateUserValidator = Joi.object().keys({
    emailVerification: Joi.string().guid().required()
}).required();

export const updateUserValidator = Joi.object().keys({
    name: Joi.string().trim().max(100),
    phone: Joi.string().trim().max(50)
}).required();

export const changePassword = Joi.object().keys({
    password: Joi.string().trim().min(8).max(20).required(),
    newPassword: Joi.string().trim().min(8).max(20).required(),
    confirmNewPassword: Joi.string().trim().min(8).max(20).required(),
}).required();