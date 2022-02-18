import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

export const getConnection = async () => {
  let connection = await mysql.createConnection({
        host     : process.env.DB_IP,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : 'meerkath_MeerkCook'
      })
  return connection
}