const pg = require('pg');
require('dotenv').config();

const config = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: 'neverskiplegday',
	password: process.env.PG_PASS,
	port: process.env.PG_PORT,
};

const client = new pg.Client(config);

function queryDatabase(query, callback){
	client.query(query)
	.then(results => {
		callback(200, results.rows);
	})
	.catch(err => {
		callback(500, err);
	});
}

module.exports = {
	query: (query, callback) => {
		client.connect(err => {
			if(err) callback(500, err);
			else {
				queryDatabase(query, callback)
			}
		});
	},
};
