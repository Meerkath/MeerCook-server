const mysql = require('mysql2/promise');

module.exports = {
  getConnection: async () => {
    const connection = await mysql.createConnection({
      host: process.env.DB_IP,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'meerkath_MeerCook',
    });
    return connection;
  },
};
