const {getConnection} = require('./dbConnect.js')

module.exports = {
  getIngredientsByRecipeId: async (recipeId) => {
    try{
      const connection = await getConnection()
      const [ingredients] = await connection.execute(
        'SELECT * FROM ingredient WHERE recipeId = ?',
        [recipeId],
      )
      connection.close()
      return ingredients
    }catch(e){
      console.error(`Could not get ingredients by recipe id : ${e.message}`)
      connection.close()
      return false
    }
  },
}
