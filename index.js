import express from 'express'
import recipes from './routes/recipes.js'
const app = express()

app.use('/recipes', recipes)

app.listen(80, () => {
  console.log("OK -- Server Started")
})
