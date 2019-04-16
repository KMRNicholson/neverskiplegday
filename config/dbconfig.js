const pg = require('pg');
require('dotenv').config();

const config = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_NAME,
	password: process.env.PG_PASS,
	port: process.env.PG_PORT,
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
