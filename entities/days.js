const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'days';

const findAllDays = (callback) => {
  entities.findAllEntities(table, callback)
}

const findDayByName = (name, callback) => {
  db.query(`
    SELECT id 
    FROM days 
    WHERE name = ${name};`,
    callback
  );
}

const findDayById = (id, callback) => {
  entities.findEntityById(id, table, callback);
}

module.exports = {
  findAllDays,
  findDayById,
  findDayByName
}