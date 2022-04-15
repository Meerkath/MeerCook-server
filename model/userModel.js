const {getConnection} = require('./dbConnect.js')

module.exports = {
  getUserByEmailOrUsername: async (emailOrUsername) => {
    const connection = await getConnection()
    const sqlSelect = 'SELECT *'
    const sqlFrom = 'FROM user'
    const sqlWhere = 'WHERE email = ? OR username = ?'
    try {
      const [user] = await connection.execute(
        [sqlSelect, sqlFrom, sqlWhere].join(' '),
        [emailOrUsername, emailOrUsername])
      return user[0]
    } catch (e) {
      throw new Error(`Could not get user by email or username : ${e.message}`)
    }
  },
}
