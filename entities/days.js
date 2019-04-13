const pool = require('../config/dbconfig').pool;
const entities = require('./entities');
const table = 'day';

const findDayByName = (name, callback) => {
  return pool.query('SELECT id FROM day WHERE name = $1', [name], (err, res) => {
    callback(err, res.rows[0]);
  });
}

const findDayById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

module.exports = {
  findDayById,
  findDayByName
}