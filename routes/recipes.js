const express = require('express');
const router = new express.Router();
const getRecipes = require('../controller/recipeController.js');

router.get('/', getRecipes);

module.exports = router;
