const {getConnection} = require('./dbConnect.js');

module.exports = async function getAllRecipes() {
  const connection = await getConnection();
  const [recipes] = await connection.execute('select * from recipe');
  return recipes;
};
