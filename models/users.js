const Joi = require("joi");

// In-memory storage
const users = [];

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(user);
}

function findOne(query) {
  return users.find((user) => user.name === query.name);
}

function createUser(userData) {
  const user = {
    name: userData.name,
    secret: userData.secret,
    tempSecret: userData.tempSecret,
  };
  users.push(user);
  return user;
}

function updateUser(name, updates) {
  const user = users.find((u) => u.name === name);
  if (user) {
    Object.assign(user, updates);
  }
  return user;
}

module.exports.validate = validate;
module.exports.findOne = findOne;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
