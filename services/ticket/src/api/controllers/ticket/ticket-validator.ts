import * as Joi from "joi";


export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const createNewEventValidator = Joi.object().keys({
    name: Joi.string().trim().min(4).max(100).required(),
    description: Joi.string().trim().min(10).max(512).required(),
    genre: Joi.string().trim().min(3).max(100).required(),
    type: Joi.string().trim().min(4).max(100).required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().precision(2).min(1).required(),
    eventDate: Joi.date().required(),
    active: Boolean()
}).required();

export const getAllTickesValidator = Joi.object().keys({
    status: Joi.string().valid('active', '')
});

export const deactivateEventValidator = Joi.object().keys({
    id: Joi.string().guid().required()
}).required();

export const reactivateEventValidator = Joi.object().keys({
    id: Joi.string().guid().required()
}).required();

export const findEventValidator = Joi.object().keys({
    id: Joi.string().guid().required()
}).required();

export const updateEventParamsValidator = Joi.object().keys({
    id: Joi.string().guid().required()
}).required();

export const updateEventPayloadValidator = Joi.object().keys({
    name: Joi.string().trim().min(4).max(100),
    description: Joi.string().trim().min(10).max(512),
    genre: Joi.string().trim().min(3).max(100),
    type: Joi.string().trim().min(4).max(100),
    quantity: Joi.number().integer().min(1),
    price: Joi.number().precision(2).min(1),
    eventDate: Joi.date(),
}).required();