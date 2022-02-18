const express = require('express')
// import recipes from './routes/recipes.js'
const app = express()

app.use('/meercook-server/recipes', recipes)
app.get('/meercook-server', function (req, res) {
  console.log('hello');
  res.send("hello")
})
app.listen()
