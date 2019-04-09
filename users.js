const pool = require('./dbconfig').pool;

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (id, callback) => {
  return pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    callback(err, results.rows[0]);
  })
}

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

const updateUser = (request, response) => {
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
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  findUserByEmail,
  updateUser,
  deleteUser,
}