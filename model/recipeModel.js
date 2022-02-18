const { getConnection } = require('./dbConnect.js')

module.exports = async function getAllRecipes() {
  const connection = await getConnection()
  let [recipes] = await connection.execute('select * from recipe')
  return recipes
}