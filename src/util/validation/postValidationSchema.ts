import Joi from 'joi';

const createPostValidationSchema = body => {
  const schema = Joi.object({
    content: Joi.string().required().label('Content'),
    visibility: Joi.string().valid('only_me', 'friends', 'public').label('Visibility'),
  });

  return schema.validate(body);
};

const updatePostValidationSchema = body => {
  const schema = Joi.object({
    content: Joi.string().label('Content'),
    visibility: Joi.string().valid('only_me', 'friends', 'public').label('Visibility'),
  });

  return schema.validate(body);
};

const postCommentValidationSchema = body => {
  const schema = Joi.object({
    content: Joi.string().required().label('Content'),
  });

  return schema.validate(body);
};

const reactionSchema = body => {
  const schema = Joi.object({
    type: Joi.string().valid('like', 'love', 'haha', 'angry', 'sad').label('Content'),
  });

  return schema.validate(body);
};

export default { createPostValidationSchema, updatePostValidationSchema, postCommentValidationSchema, reactionSchema };
