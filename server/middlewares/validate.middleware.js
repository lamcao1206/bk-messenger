import Joi from 'joi';
import { BadRequestException } from '../cores/application.exception.js';

const signUpDTO = Joi.object({
  username: Joi.string().min(5).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const loginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

export function validateSignUpRequest(req, res, next) {
  const { error } = signUpDTO.validate(req.body);
  if (error) {
    throw new BadRequestException(error.message);
  }
  next();
}

export function validateLoginRequest(req, res, next) {
  const { error } = loginDTO.validate(req.body);
  if (error) {
    throw new BadRequestException(error.message);
  }
  next();
}
