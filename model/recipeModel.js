import { getConnection } from './dbConnect.js'

export async function getAllRecipes() {
  const connection = await getConnection()
  let [recipes] = await connection.execute('select * from recipe')
  return recipes
}