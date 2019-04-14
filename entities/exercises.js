const entities = require('./entities');
const pool = require('../config/dbconfig').pool;
const table = 'exercises';

const findAllExercises = callback => {
	return entities.findAllEntities(table, callback);
};

const findExerciseById = (id, callback) => {
	return entities.findEntityById(id, table, callback);
};

module.exports = {
	findAllExercises,
	findExerciseById,
};
