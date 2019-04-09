const pool = require('../config/dbconfig').pool;
const entities = require('./entities');

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
  console.log(id);
  return entities.findEntityById(id, "users",callback);
}

const deleteUserById = (id, callback) => {
  return entities.findEntityById(id, "users", callback);
}

/*const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { email, password, first_name, last_name } = request.body

  pool.query(
    'UPDATE users SET email = $1 WHERE id = $5',
    [email, password, first_name, last_name, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}*/

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  deleteUserById
}