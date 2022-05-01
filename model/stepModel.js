const {getConnection} = require('./dbConnect.js')

module.exports = {
  getStepsByRecipeId: async (recipeId) => {
    try{
      const connection = await getConnection()
      const [steps] = await connection.execute(
        'SELECT * FROM step WHERE recipeId = ?',
        [recipeId],
      )
      connection.close()
      return steps
    }catch(e){
      console.error(`Could not get steps by recipe id : ${e.message}`)
      connection.close()
      return false
    }
  },
}
