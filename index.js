import express from 'express'
import recipes from './routes/recipes.js'
const app = express()

app.use('MeerCook-server/recipes', recipes)
app.get('/', function (req, res) {
  res.send("hello")
})
app.listen()
