const getAllRecipes = require('../model/recipeModel.js')
module.exports = async function getRecipes(req, res) {
    res.send(await getAllRecipes())
}