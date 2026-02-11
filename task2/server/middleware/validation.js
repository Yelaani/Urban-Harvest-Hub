// Validation middleware for request body validation using Joi
import Joi from 'joi';

// Product validation schema
const productSchema = Joi.object({
    title: Joi.string().trim().min(1).required()
        .messages({
            'string.empty': 'Title is required and must be a non-empty string',
            'any.required': 'Title is required'
        }),
    price: Joi.number().min(0).required()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be a non-negative number',
            'any.required': 'Price is required'
        }),
    category: Joi.string().required()
        .messages({
            'string.empty': 'Category is required',
            'any.required': 'Category is required'
        }),
    description: Joi.string().allow('').optional(),
    image: Joi.string().allow('', null).custom((value, helpers) => {
        // Allow empty string or valid URI
        if (!value || value === '' || value === null || value === undefined) {
            return '';
        }
        try {
            new URL(value);
            return value;
        } catch {
            return helpers.error('string.uri');
        }
    }).optional(),
    availability: Joi.string().allow('').optional()
});

// Workshop validation schema
const workshopSchema = Joi.object({
    title: Joi.string().trim().min(1).required()
        .messages({
            'string.empty': 'Title is required and must be a non-empty string',
            'any.required': 'Title is required'
        }),
    price: Joi.number().min(0).required()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be a non-negative number',
            'any.required': 'Price is required'
        }),
    date: Joi.string().required()
        .messages({
            'string.empty': 'Date is required',
            'any.required': 'Date is required'
        }),
    location: Joi.string().trim().min(1).required()
        .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
    description: Joi.string().allow('').optional(),
    image: Joi.string().uri().allow('').optional(),
    coordinates: Joi.object({
        lat: Joi.number(),
        lng: Joi.number()
    }).optional()
});

// Event validation schema
const eventSchema = Joi.object({
    title: Joi.string().trim().min(1).required()
        .messages({
            'string.empty': 'Title is required and must be a non-empty string',
            'any.required': 'Title is required'
        }),
    price: Joi.number().min(0).required()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be a non-negative number',
            'any.required': 'Price is required'
        }),
    date: Joi.string().required()
        .messages({
            'string.empty': 'Date is required',
            'any.required': 'Date is required'
        }),
    location: Joi.string().trim().min(1).required()
        .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
    description: Joi.string().allow('').optional(),
    image: Joi.string().uri().allow('').optional(),
    coordinates: Joi.object({
        lat: Joi.number(),
        lng: Joi.number()
    }).optional()
});

// Validation middleware helper
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            allowUnknown: true, // Allow unknown fields (like date, location for products)
            stripUnknown: true   // Strip unknown fields from the validated result
        });
        
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ message: messages });
        }
        
        // Replace req.body with validated and sanitized value
        req.body = value;
        next();
    };
};

export const validateProduct = validate(productSchema);
export const validateWorkshop = validate(workshopSchema);
export const validateEvent = validate(eventSchema);
