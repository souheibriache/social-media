import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const signUpBodyValidation = body => {
  const schema = Joi.object({
    userName: Joi.string().required().label('userName'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
  });

  return schema.validate(body);
};

const logInBodyValidation = body => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = body => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label('Refresh Token'),
  });
  return schema.validate(body);
};

const createProfileValidation = body => {
  const schema = Joi.object({
    dateOfBirth: Joi.date().required().label('Date of birth'),
    gender: Joi.any().required().valid('Male', 'Female'),
  });
  return schema.validate(body);
};

const updateProfileValidation = body => {
  const schema = Joi.object({
    dateOfBirth: Joi.date().label('Date of birth'),
    gender: Joi.any().valid('Male', 'Female'),
    userName: Joi.string().label('User Name'),
  });
  return schema.validate(body);
};

export {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
  createProfileValidation,
  updateProfileValidation,
};
