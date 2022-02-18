import express from 'express'
import recipes from './routes/recipes.js'
const app = express()

app.use('/meercook-server/recipes', recipes)
app.get('/meercook-server', function (req, res) {
  res.send("hello")
})
app.listen()
