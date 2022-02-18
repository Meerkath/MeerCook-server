import express from 'express'
import recipes from './routes/recipes.js'
const app = express()

app.use('/recipes', recipes)

app.listen(3000, () => {
  console.log("OK -- Server Started")
})
