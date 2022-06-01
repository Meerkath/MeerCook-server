const {getConnection} = require('./dbConnect.js')

module.exports = {
  getAllByUserId: async (userId) => {
    const connection = await getConnection()
    const [recipes] = await connection.execute(
      'SELECT * FROM recipe WHERE userId = ?',
      [userId],
    )
    
    return recipes
  },
  saveOrReplaceRecipe: async (recipe) => {
    const connection = await getConnection()
    let sql = 'INSERT INTO recipe(id, userId, title, description) VALUES (' + (recipe.id ? '?' : 'default') + ', ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, description = ?'
    let values = [
      recipe.id,
      recipe.userId,
      recipe.title,
      recipe.description || null,
      recipe.title,
      recipe.description || null,
    ]
    !recipe.id && values.shift()
    try{
      const [result] = await connection.execute(
        sql,
        values,
      )
      
      return result.insertId
    }
    catch(e){
      console.error(`Could not save or replace recipe : ${e.message}`)
      
      return false
    }
  },
  deleteRecipeById: async (recipeId) => {
    const connection = await getConnection()
    try{
      await connection.execute(
        'DELETE FROM recipe WHERE id = ?',
        [recipeId],
      )
      
      return true
    }catch(e){
      console.error(`Could not delete recipe : ${e.message}`)
      
      return false
    }
  },
  getRecipeById: async (recipeId) => {
    const connection = await getConnection()
    try{
      const [recipe] = await connection.execute(
        'SELECT * FROM recipe WHERE id = ?',
        [recipeId],
      )
      
      return recipe[0]
    }catch(e){
      console.error(`Could not get recipe by id : ${e.message}`)
      
      return false
    }
  }
}
