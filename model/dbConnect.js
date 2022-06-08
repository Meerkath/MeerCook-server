const mysql = require('mysql2/promise')
module.exports = {
  getConnection: async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_IP,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'meerkath_MeerCook',
      })
      return connection
    } catch (e) {
      console.error(e)
    }
  },
}
