const pool = require('../config/dbconfig').pool;
const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'days';

const findAllDays = (callback) => {
  db.query("select * from days", callback)
}

const findDayByName = (name, callback) => {
  return pool.query('SELECT id FROM days WHERE name = $1', [name], (err, res) => {
    callback(err, res.rows[0]);
  });
}

const findDayById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

module.exports = {
  findAllDays,
  findDayById,
  findDayByName
}