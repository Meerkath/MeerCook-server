const fs = require('fs')
const path = require('path')
const { getStepsByRecipeId, saveSteps, getStepById, deleteStepsByRecipeId } = require('../model/stepModel.js')
const { getIngredientsByRecipeId, saveIngredients, getIngredientById, deleteIngredientsByRecipeId } = require('../model/ingredientModel.js')
const { getAllByUserId, saveOrReplaceRecipe, deleteRecipeById, getRecipeById } = require('../model/recipeModel.js')

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
    const imgPath = path.join(__dirname, '../images', 
      `${res.locals.user.id}_${req.params.imgId}.jpg`)
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
    const recipe = req.body
    if (!recipe.title) {
      res.status(400)
        .send('Please provide title attribute.'); return
    }
    if(recipe.id) {
      const existingRecipe = await getRecipeById(recipe.id)
      if(!existingRecipe) {
        res.status(404).send('Recipe not found'); return
      }
      if(existingRecipe.userId !== res.locals.user.id) {
        res.status(403).send('You are not authorized to edit this recipe'); return
      }
    }
    recipe.userId = res.locals.user.id
    const insertId = await saveOrReplaceRecipe(recipe)
    if(insertId) {
      res.send({'insertId': insertId})
    } else {
      res.sendStatus(500)
    }
  },

  saveRecipeIngredients: async (req, res) => {
    const recipeId = req.params.recipeId
    const ingredients = JSON.parse(req.body.ingredients)
    if(!recipeId) {
      res.status(400)
        .send('Please provide recipeId attribute.'); return
    }
    if(!ingredients) {
      res.status(400)
        .send('Please provide ingredients attribute.'); return
    }
    const existingRecipe = await getRecipeById(recipeId)
    if(!existingRecipe) {
      res.status(404).send('Recipe not found'); return
    }
    if(existingRecipe.userId !== res.locals.user.id) {
      res.status(403).send('You are not authorized to edit this recipe'); return
    }
    for (const ingredient of ingredients) {
      if(!ingredient.text) {
        res.status(400)
          .send('Please provide ingredient\'s text attribute.'); return
      }
    }
    await deleteIngredientsByRecipeId(recipeId)
    if(ingredients.length === 0) {
      res.sendStatus(200); return
    }
    if(await saveIngredients(recipeId, ingredients)) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  },
  
  saveRecipeSteps: async (req, res) => {
    const recipeId = req.params.recipeId
    const steps = JSON.parse(req.body.steps)
    if(!recipeId) {
      res.status(400)
        .send('Please provide recipeId attribute.'); return
    }
    if(!steps) {
      res.status(400)
        .send('Please provide steps attribute.'); return
    }
    const existingRecipe = await getRecipeById(recipeId)
    if(!existingRecipe) {
      res.status(404).send('Recipe not found'); return
    }
    if(existingRecipe.userId !== res.locals.user.id) {
      res.status(403).send('You are not authorized to edit this recipe'); return
    }
    await deleteStepsByRecipeId(recipeId)
    const sortIdList = []
    for (const step of steps) {
      if(!step.text && step.text !== '') {
        res.status(400)
          .send('Please provide step\'s text attribute.'); return
      }
      if(!step.sortId || step.sortId < 0 || isNaN(step.sortId)) {
        res.status(400)
          .send('Please provide step\'s sortId attribute and make sure it\'s a number above 0.'); return
      }
      if(sortIdList.includes(step.sortId)) {
        res.status(400)
          .send('Please make sure step\'s sortId attribute is unique.'); return
      }
      sortIdList.push(step.sortId)
    }
    if(await saveSteps(recipeId, steps)) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  },

  deleteRecipe: async (req, res) => {
    if (!req.params.recipeId) {
      res.status(400)
        .send({message: 'Please provide recipeId attribute.'}); return
    }
    let recipeToDelete = await getRecipeById(req.params.recipeId)
    if(!recipeToDelete) {
      res.status(404)
        .send('Recipe not found.'); return
    }
    if(recipeToDelete.userId !== res.locals.user.id) {
      res.status(403)
        .send({message: 'You are not allowed to delete this recipe.'}); return
    }
    if(!(await deleteRecipeById(req.params.recipeId))) {
      res.sendStatus({message: 'Could not delete recipe.'}); return
    }
    if(!(await deleteStepsByRecipeId(req.params.recipeId))) {
      res.sendStatus({message: 'Could not delete steps.'}); return
    }
    if(!(await deleteIngredientsByRecipeId(req.params.recipeId))) {
      res.sendStatus({message: 'Could not delete ingredients.'}); return
    }
    res.sendStatus(200)
  },

  getRecipeIngredients: async (req, res) => {
    if(!req.params.recipeId){
      res.status(400).send({ message: 'Please provide recipeId attribute.'}); return
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
  },
  
  getRecipeSteps: async (req, res) => {
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
    recipe.steps = await getStepsByRecipeId(recipe.id)
    res.status(200).send(recipe)
  }
}