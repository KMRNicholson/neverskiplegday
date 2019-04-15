const pool = require('../config/dbconfig').pool;
const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'users';



const createUser = (user, callback) => {
  return pool.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)', user, (err) => {
    callback(err);
  });
}

const findUserByEmail = (email, callback) => {
  return pool.query('SELECT * FROM users WHERE email = $1', [email], (err, results) => {
    callback(err, results.rows[0]);
  })
}

const findUserById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const deleteUserById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const updateUserById = (user, callback) => {
  return pool.query('UPDATE users SET email = $2, first_name = $3, last_name = $4, weight = $5 WHERE id = $1', user, (err) => {
    callback(err);
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById
}