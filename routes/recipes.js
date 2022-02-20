const express = require('express');
const {authenticateToken} = require('../controller/auth.js');
const router = new express.Router();
const {getRecipes} = require('../controller/recipeController.js');

router.get('/', authenticateToken, getRecipes);

module.exports = router;
