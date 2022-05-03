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
  saveOrReplaceStep: async (step) => {
    const connection = await getConnection()
    try{
      const sql = 'INSERT INTO step(id, recipeId, text, sortId) VALUES (' + (step.id ? '?' : 'default') + ', ?, ?, ?) ON DUPLICATE KEY UPDATE text = ?'
      let values = [
        step.id,
        step.recipeId,
        step.text || null,
        step.sortId,
        step.text || null,
      ]
      !step.id && values.shift() 
      await connection.execute(
        sql,
        values
      )
      connection.close()
      return true
    }catch(e){
      console.error(`Could not save or replace step : ${e.message}`)
      connection.close()
      return false
    }
  },
  getStepById: async (stepId) => {
    const connection = await getConnection()
    try{
      const [step] = await connection.execute(
        'SELECT * FROM step WHERE id = ?',
        [stepId],
      )
      connection.close()
      return step[0]
    }catch(e){
      console.error(`Could not get step by id : ${e.message}`)
      connection.close()
      return false
    }
  },
  deleteStepsByRecipeId: async (recipeId) => {
    const connection = await getConnection()
    try{
      await connection.execute(
        'DELETE FROM step WHERE recipeId = ?',
        [recipeId],
      )
      connection.close()
      return true
    }catch(e){
      console.error(`Could not delete steps by recipe id : ${e.message}`)
      connection.close()
      return false
    }
  }
}
