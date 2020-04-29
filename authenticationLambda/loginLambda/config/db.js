module.exports = require('knex')({
    client: 'mysql2',
    connection: {
      host : process.env.HOST,
      user : process.env.USERNAME,
      password : process.env.PASSWORD,
      database : process.env.DB
    }
});