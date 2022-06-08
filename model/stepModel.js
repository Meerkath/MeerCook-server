const {getConnection} = require('./dbConnect.js')

module.exports = {
  getStepsByRecipeId: async (recipeId) => {
    try{
      const connection = await getConnection()
      const [steps] = await connection.execute(
        'SELECT * FROM step WHERE recipeId = ?',
        [recipeId],
      )
      await connection.end()
      return steps
    }catch(e){
      console.error(`Could not get steps by recipe id : ${e.message}`)
      await connection.end()
      return false
    }
  },
  saveSteps: async (recipeId, steps) => {
    const connection = await getConnection()
    try{
      let sql = 'INSERT INTO step(recipeId, text, sortId) VALUES'
      let values = []
      steps.forEach((step) => {
        sql += '(?, ?, ?),'
        values.push(recipeId, step.text, step.sortId)
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
      console.error(`Could not save or replace step : ${e.message}`)
      await connection.end()
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
      await connection.end()
      return step[0]
    }catch(e){
      console.error(`Could not get step by id : ${e.message}`)
      await connection.end()
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
      await connection.end()
      return true
    }catch(e){
      console.error(`Could not delete steps by recipe id : ${e.message}`)
      await connection.end()
      return false
    }
  }
}
