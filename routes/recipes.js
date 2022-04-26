const express = require('express')
const {authenticateToken} = require('../controller/auth.js')
const router = new express.Router()
const {getAllRecipes, getImage, saveRecipe, getRecipe, deleteRecipe, getRecipeDetails} = require('../controller/recipeController.js')

router.get('/', authenticateToken, getAllRecipes)
router.get('/image/:imgId', authenticateToken, getImage)
router.get('/:recipeId', authenticateToken, getRecipe)
router.get('/details/:recipeId', authenticateToken, getRecipeDetails)
router.post('/save', authenticateToken, saveRecipe)
router.post('/delete/:recipeId', authenticateToken, deleteRecipe)

module.exports = router
