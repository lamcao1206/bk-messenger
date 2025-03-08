import Joi from 'joi';

const signUpDTO = Joi.object({
  username: Joi.string().min(5).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const loginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});
