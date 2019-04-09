const entities = require('./entities');
const table = 'day';

const findDayById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

module.exports = {
  findDayById
}