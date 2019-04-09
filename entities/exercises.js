const entities = require('./entities');
const table = 'exercises';

const findExerciseById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

module.exports = {
  findExerciseById
}