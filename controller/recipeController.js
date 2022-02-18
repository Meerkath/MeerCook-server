import { getAllRecipes } from '../model/recipeModel.js'
export async function getRecipes(req, res) {
    res.send(await getAllRecipes())
}