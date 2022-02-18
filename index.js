const express = require('express')
const recipes = require('./routes/recipes')
const app = express()

app.use('/meercook-server/recipes', recipes)
app.get('/meercook-server', function (req, res) {
  console.log('hello');
  res.send("hello")
})
app.listen(3000)
