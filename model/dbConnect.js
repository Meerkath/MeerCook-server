const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  getConnection: async () => {
    let connection = await mysql.createConnection({
          host     : process.env.DB_IP,
          user     : process.env.DB_USER,
          password : process.env.DB_PASSWORD,
          database : 'meerkath_MeerkCook'
        })
    return connection
  }
} 