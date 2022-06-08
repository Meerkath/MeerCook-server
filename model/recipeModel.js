const {getConnection} = require('./dbConnect.js')

module.exports = {
  getAllByUserId: async (userId) => {
    const connection = await getConnection()
    const [recipes] = await connection.execute(
      'SELECT * FROM recipe WHERE userId = ?',
      [userId],
    )
    await connection.end()
    return recipes
  },
  saveOrReplaceRecipe: async (recipe) => {
    const connection = await getConnection()
    let sql = 'INSERT INTO recipe(id, userId, title, description) VALUES (' + (recipe.id ? '?' : 'default') + ', ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, description = ?'
    let values = [
      recipe.id,
      recipe.userId,
      recipe.title,
      recipe.description || '',
      recipe.title,
      recipe.description || '',
    ]
    !recipe.id && values.shift()
    try{
      const [result] = await connection.execute(
        sql,
        values,
      )
      await connection.end()
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
      await connection.end()
      return true
    }catch(e){
      console.error(`Could not delete recipe : ${e.message}`)
      await connection.end()
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
      await connection.end()
      return recipe[0]
    }catch(e){
      console.error(`Could not get recipe by id : ${e.message}`)
      await connection.end()
      return false
    }
  }
}
