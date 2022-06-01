const mysql = require('mysql2/promise')
let connection
module.exports = {
  setConnection: async () => {
    try {
      connection = mysql.createPool({
        host: process.env.DB_IP,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'meerkath_MeerCook',
        waitForConnections: true,
        connectionLimit: 3,
        queueLimit: 0
      })
    } catch (e) {
      throw new Error('Error while connecting to database.', e.message)
    }
  },
  getConnection() { return connection },
}
