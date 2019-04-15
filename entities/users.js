const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'users';

const createUser = (user, callback) => {
  db.query(`
    INSERT INTO users (email, password, first_name, last_name) 
    VALUES ('${user.email}', '${user.pass}', '${user.firstname}', '${user.lastname}');`,
    callback
  );
}

const findUserByEmail = (email, callback) => {
  db.query(`SELECT * FROM users WHERE email = '${email}';`, callback)
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
    SET email = '${user.email}', 
        first_name = '${user.firstname}', 
        last_name = '${user.lastname}', 
        weight = ${user.weight} 
        WHERE id = ${user.id};`,
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