const Joi = require('joi');
const User = require('../models/User');
const passwordReg = new RegExp('^[a-zA-Z0-9!@#$%^&*()_+-=]{8,30}$');

const registerSchema = Joi.object({
    email: Joi.string()
        .required()
        .min(3)
        .email()
        .external(async (value, helpers) => {
            const existing = await User.findOne({ where: { email: value } });
            if (existing) {
                throw new Error('Email already exists');
            }
            return value;
        }),

    password: Joi.string()
        .required()
        .min(8)
        .pattern(passwordReg)
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
        .min(8)
        .pattern(passwordReg)
})

const todoIndexSchema = Joi.object( {
    user_id: Joi.number()
        .required(),
})

const todoCreateSchema = Joi.object( {
    name: Joi.string()
        .required(),
    description: Joi.string()
        .allow(''),
    user_id: Joi.number()
        .required(),
    status: Joi.string()
        .valid('pending', 'in_progress', 'completed')
        .default('pending'),
})

const todoUpdateSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in_progress', 'completed')
        .required(),
});