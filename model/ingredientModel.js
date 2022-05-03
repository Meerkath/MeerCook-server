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
  saveOrReplaceIngredient: async (ingredient) => {
    const connection = await getConnection()
    try{
      const sql = 'INSERT INTO ingredient(id, recipeId, text) VALUES (' + (ingredient.id ? '?' : 'default') + ', ?, ?) ON DUPLICATE KEY UPDATE text = ?'
      let values = [
        ingredient.id,
        ingredient.recipeId,
        ingredient.text || null,
        ingredient.text || null,
      ]
      !ingredient.id && values.shift() 
      await connection.execute(
        sql,
        values
      )
      connection.close()
      return true
    }catch(e){
      console.error(`Could not save or replace ingredient : ${e.message}`)
      connection.close()
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
      connection.close()
      return ingredient[0]
    }catch(e){
      console.error(`Could not get ingredient by id : ${e.message}`)
      connection.close()
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
      connection.close()
      return true
    }catch(e){
      console.error(`Could not delete ingredient by recipe id : ${e.message}`)
      connection.close()
      return false
    }
  }
}
