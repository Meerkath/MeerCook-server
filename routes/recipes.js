const express = require('express')
const {authenticateToken} = require('../controller/auth.js')
const router = new express.Router()
const {getRecipes, getImage} = require('../controller/recipeController.js')

router.get('/', authenticateToken, getRecipes)
router.get('/image/:imgId', authenticateToken, getImage)

module.exports = router
