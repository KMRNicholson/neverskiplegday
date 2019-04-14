const pool = require('../config/dbconfig').pool;

module.exports = {
  findAllEntities: (table, callback) => {
    return pool.query('SELECT * FROM ' + table, (err, results) => {
      callback(err, results.rows);
    })
  },
  findEntityById: (id, table, callback) => {
    return pool.query('SELECT * FROM ' + table + ' WHERE id = $1', [id], (err, results) => {
      callback(err, results.rows[0]);
    })
  },
  deleteEntityById: (id, table, callback) => {
    return pool.query('DELETE FROM ' + table + ' WHERE id = $1', [id], (err) => {
      callback(err)
    })
  }
}