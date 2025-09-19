import Joi from 'joi';

// Common validation schemas

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  displayName: Joi.string().min(2).max(50).required(),
  profileVisibility: Joi.string().valid('public', 'private').default('public'),
  locale: Joi.string().length(2).default('en'),
});

export const photoSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).default([]),
  captureDate: Joi.date().required(),
  dateConfidence: Joi.string().valid('exact', 'decade', 'estimated').required(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().max(200).optional(),
  }).required(),
  locationConfidence: Joi.string().valid('exact', 'approximate', 'estimated').required(),
  license: Joi.string().required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

export const searchSchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  filters: Joi.object({
    decade: Joi.string().optional(),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
      radius: Joi.number().min(1).max(1000), // in kilometers
    }).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});
