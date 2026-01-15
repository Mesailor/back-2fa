const Joi = require("joi");

// In-memory storage
const users = [];

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    key: Joi.number().required(),
  });

  return schema.validate(user);
}

function findOne(query) {
  return users.find((user) => user.name === query.name);
}

function createUser(userData) {
  const user = {
    name: userData.name,
    key: userData.key,
  };
  users.push(user);
  return user;
}

module.exports.validate = validate;
module.exports.findOne = findOne;
module.exports.createUser = createUser;
