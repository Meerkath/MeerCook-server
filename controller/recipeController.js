const fs = require('fs')
const path = require('path')
const { getIngredientsByRecipeId } = require('../model/ingredient.js')
const {getAllByUserId, saveOrReplace, deleteRecipeById, getRecipeById} = require('../model/recipeModel.js')

module.exports = {
  getAllRecipes: async (_req, res) => {
    res.send(await getAllByUserId(res.locals.user.id))
  },

  getRecipe: async (req, res) => {
    let recipe = await getRecipeById(req.params.recipeId)
    if(!recipe){
      res.status(404).send('Recipe not found'); return 
    }
    if(recipe.userId !== res.locals.user.id){
      res.status(403).send('You are not authorized to view this recipe'); return
    }
    res.send(recipe)
  },

  getImage: async (req, res) => {
    if (!req.params.imgId) {
      res.status(400)
        .send('Please provide imgId attribute.'); return
    }
    // eslint-disable-next-line max-len
    const imgPath = path.join(__dirname, '../images', `${res.locals.user.id}_${req.params.imgId}.jpg`)
    try {
      if (!fs.existsSync(imgPath)) {
        res.status(404).send('Image not found.'); return
      }
      res.sendFile(imgPath)
    } catch (err) {
      throw new Error('Error while getting image.', err)
    }
  },

  saveRecipe: async (req, res) => {
    if (!req.body.recipe) {
      res.status(400).send('Please provide recipe attribute.'); return
    }
    if (!req.body.recipe.title) {
      res.status(400).send('Please provide title attribute.'); return
    }
    const recipe = req.body.recipe
    recipe.userId = res.locals.user.id
    if(await saveOrReplace(recipe)) {
      res.sendStatus(200)
    }else{
      res.sendStatus(500)
    }
  },

  deleteRecipe: async (req, res) => {
    if (!req.params.recipeId) {
      res.status(400)
        .send('Please provide recipeId attribute.'); return
    }
    let recipeToDelete = await getRecipeById(req.params.recipeId)
    if(!recipeToDelete) {
      res.status(404)
        .send('Recipe not found.'); return
    }
    if(recipeToDelete.userId !== res.locals.user.id) {
      res.status(403)
        .send('You are not allowed to delete this recipe.'); return
    }
    if(!(await deleteRecipeById(req.params.recipeId))) {
      res.sendStatus(500)
    }
    res.sendStatus(200)
  },

  getRecipeDetails: async (req, res) => {
    if(!req.params.recipeId){
      res.status(400).send('Please provide recipeId attribute.'); return
    }
    const recipe = await getRecipeById(req.params.recipeId)
    if(!recipe){
      res.status(404).send('Recipe not found.'); return
    }
    if(recipe.userId !== res.locals.user.id){
      res.status(403).send('You are not authorized to view this recipe'); return
    }
    recipe.ingredients = await getIngredientsByRecipeId(recipe.id)
    res.status(200).send(recipe)
  }
}
