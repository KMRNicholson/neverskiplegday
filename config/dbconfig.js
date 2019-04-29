const pg = require('pg');
require('dotenv').config();

const config = {
	host: process.env.PG_HOST,
	user: process.env.PG_USER,
	password: process.env.PG_PASS,
	port: process.env.PG_PORT,
	database: process.env.PG_NAME
};

const pool = new pg.Pool(config);

module.exports = {
	query: (query, callback) => {
		pool.connect((err, client, done) => {
			if(err) {
				console.log(err);
				callback(500, err);
			} else {
				console.log(query);
				client.query(query, (err, results) =>{
					done();

					if(err){
						console.log(err)
						callback(500, err);
					} 
					else{
						callback(200, results.rows);
					}
				})
			}
		});
	},
};
