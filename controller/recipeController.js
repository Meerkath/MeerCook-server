const fs = require('fs')
const path = require('path')
const { getStepsByRecipeId, saveOrReplaceStep, getStepById, deleteStepsByRecipeId } = require('../model/stepModel.js')
const { getIngredientsByRecipeId, saveOrReplaceIngredient, getIngredientById, deleteIngredientsByRecipeId } = require('../model/ingredientModel.js')
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
    if (!req.body.recipe.ingredients){
      res.status(400).send('Please provide ingredients attribute.'); return
    }
    if (!req.body.recipe.steps){
      res.status(400).send('Please provide steps attribute.'); return
    }
    let recipe = req.body.recipe
    recipe.userId = res.locals.user.id
    const foundRecipe = await getRecipeById(recipe.id)
    if (recipe.id && !foundRecipe) {
      res.status(404).send({message: 'Recipe not found.'}); return
    }
    if(recipe.id && foundRecipe.userId !== res.locals.user.id){
      res.status(403).send({message: 'You are not authorized to edit this recipe.'}); return
    }
    const insertId = await saveOrReplaceRecipe(recipe)
    const recipeId = recipe.id || insertId
    if(insertId === false) {
      res.status(500).send({message: 'Could not save or replace recipe.', recipe}); return
    }
    for (const step of req.body.recipe.steps) {
      step.recipeId = recipeId
      if(!req.body.recipe.id && step.id) {
        res.status(400).send({ message: 'Don\'t specify step id if it is a new recipe.', step }); return
      }
      if(step.id) {
        const foundStep = await getStepById(step.id)
        if(!foundStep) {
          res.status(404).send({ message: 'Could not find step with id ' + step.id + '.' }); return
        }
        if(foundStep.recipeId !== recipeId) {
          res.status(400).send({ message: 'Step with id ' + step.id + ' is not part of recipe with id ' + recipeId + '.'}); return
        }
      }
      if(!(await saveOrReplaceStep(step))) {
        res.status(500).send({ message: 'Could not save or replace step.', step }); return
      }
    }
    for (const ingredient of req.body.recipe.ingredients) {
      ingredient.recipeId = recipeId
      if(!req.body.recipe.id && ingredient.id) {
        res.status(400).send({message: 'Don\'t specify ingredient id if it is a new recipe.', ingredient}); return
      }
      if(ingredient.id){
        const foundIngredient = await getIngredientById(ingredient.id)
        if(!foundIngredient) {
          res.status(404).send({ message: 'Could not find ingredient with id ' + ingredient.id + '.' }); return
        }
        if(foundIngredient.recipeId !== recipeId) {
          res.status(400).send({ messsage: 'Ingredient with id ' + ingredient.id + ' is not part of recipe with id ' + recipeId + '.'}); return
        }
      }
      if(!(await saveOrReplaceIngredient(ingredient))) {
        res.status(500).send({ message: 'Could not save or replace ingredient.', ingredient }); return
      }
    }
    res.status(201).send({ message: 'Recipe saved or replaced.', recipeId })
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