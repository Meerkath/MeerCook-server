import express from 'express'
const router = express.Router()
import { getRecipes } from '../controller/recipeController.js'

router.get('/', getRecipes);

export default router;