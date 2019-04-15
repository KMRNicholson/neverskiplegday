const pool = require('../config/dbconfig').pool;
const db = require('../config/dbconfig');

module.exports = {
  findAllEntities: (table, callback) => {
    db.query(`SELECT * FROM ${table};`,
      callback
  )
  },
  findEntityById: (id, table, callback) => {
    db.query(`SELECT * FROM ${table} WHERE id = ${id};`, 
      callback
    )
  },
  deleteEntityById: (id, table, callback) => {
    db.query(`DELETE FROM ${table} WHERE id = ${id};`,
      callback
    )
  }
}