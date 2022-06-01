const {getConnection} = require('./dbConnect.js')

module.exports = {
  getIngredientsByRecipeId: async (recipeId) => {
    try{
      const connection = await getConnection()
      const [ingredients] = await connection.execute(
        'SELECT * FROM ingredient WHERE recipeId = ?',
        [recipeId],
      )
      
      return ingredients
    }catch(e){
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
      
      return true
    }catch(e){
      console.error(`Could not save ingredient : ${e.message}`)
      
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
      
      return ingredient[0]
    }catch(e){
      console.error(`Could not get ingredient by id : ${e.message}`)
      
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
      
      return true
    }catch(e){
      console.error(`Could not delete ingredient by recipe id : ${e.message}`)
      
      return false
    }
  }
}
