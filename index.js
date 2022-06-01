const express = require('express')
const recipes = require('./routes/recipes')
const users = require('./routes/users')
const bodyParser = require('body-parser')
const cors = require('cors')
const { setConnection } = require('./model/dbConnect')
const app = express()
require('dotenv').config()
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/meercook-server/recipes', recipes)
app.use('/meercook-server/user', users)

app.get('/meercook-server', (req, res) => {
  console.log('root')
  res.send('root')
})
app.listen(process.env.PORT, () => {
  setConnection()
  console.log(
    `OK -- Server started at localhost:${process.env.PORT}/meercook-server/`,
  )
})
