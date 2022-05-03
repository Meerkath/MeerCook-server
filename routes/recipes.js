const express = require('express')
const {authenticateToken} = require('../controller/auth.js')
const router = new express.Router()
const {getAllRecipes, getImage, saveRecipe, getRecipe, deleteRecipe, getRecipeIngredients, getRecipeSteps} = require('../controller/recipeController.js')

router.get('/', authenticateToken, getAllRecipes)
router.get('/image/:imgId', authenticateToken, getImage)
router.get('/:recipeId', authenticateToken, getRecipe)
router.get('/:recipeId/ingredients', authenticateToken, getRecipeIngredients)
router.get('/:recipeId/steps', authenticateToken, getRecipeSteps)
router.post('/save', authenticateToken, saveRecipe)
router.delete('/delete/:recipeId', authenticateToken, deleteRecipe)

module.exports = router
