const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'users';

const createUser = (user, callback) => {
  db.query(`
    INSERT INTO users (email, password, first_name, last_name) 
    VALUES (${user[0]}, ${user[1]}, ${user[2]}, ${user[3]});`,
    callback
  );
}

const findUserByEmail = (email, callback) => {
  db.query(`SELECT * FROM users WHERE email = ${email};`, callback)
}

const findUserById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const deleteUserById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const updateUserById = (user, callback) => {
  db.query(`
    UPDATE users 
    SET email = ${user[1]}, 
        first_name = ${user[2]}, 
        last_name = ${user[3]}, 
        weight = ${user[4]}, 
        WHERE id = ${user[0]};`,
    callback
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById
}