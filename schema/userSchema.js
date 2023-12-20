const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  username: Joi.string().required(),
  age: Joi.number().required(),
  hobbies: Joi.array().items(Joi.string()).required(),
});

module.exports = userSchema;
