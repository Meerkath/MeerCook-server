const {getConnection} = require('./dbConnect.js')

module.exports = {
  getIngredientsByRecipeId: async (recipeId) => {
    const connection = await getConnection()
    try{
      const [ingredients] = await connection.execute(
        'SELECT * FROM ingredient WHERE recipeId = ?',
        [recipeId],
      )
      await connection.end()
      return ingredients
    }catch(e){
      await connection.end()
      console.error(`Could not get ingredients by recipe id : ${e.message}`)
      return false
    }
  },
  saveIngredients: async (recipeId, ingredients) => {
    const connection = await getConnection()
    try{
      let sql = 'INSERT INTO ingredient(recipeId, text) VALUES'
      let values = []
      ingredients.forEach((ingredient) => {
        sql += '(?, ?),'
        values.push(recipeId, ingredient.text)
      })
      // Removing trailing coma
      sql = sql.replace(/,+$/, '')
      await connection.execute(
        sql,
        values
      )
      await connection.end()
      
      return true
    }catch(e){
      console.error(`Could not save ingredient : ${e.message}`)
      await connection.end()
      
      return false
    }
  },
  getIngredientById: async (ingredientId) => {
    const connection = await getConnection()
    try{
      const [ingredient] = await connection.execute(
        'SELECT * FROM ingredient WHERE id = ?',
        [ingredientId],
      )
      await connection.end()
      
      return ingredient[0]
    }catch(e){
      console.error(`Could not get ingredient by id : ${e.message}`)
      await connection.end()
      
      return false
    }
  },
  deleteIngredientsByRecipeId: async (recipeId) => {
    const connection = await getConnection()
    try{
      await connection.execute(
        'DELETE FROM ingredient WHERE recipeId = ?',
        [recipeId],
      )
      await connection.end()
      
      
      return true
    }catch(e){
      console.error(`Could not delete ingredient by recipe id : ${e.message}`)
      await connection.end()
      
      
      return false
    }
  }
}
