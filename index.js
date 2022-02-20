const express = require('express');
const recipes = require('./routes/recipes');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/meercook-server/recipes', recipes);
app.use('/meercook-server/users', users);

app.get('/meercook-server', (req, res) => {
  console.log('hello');
  res.send('hello');
});
app.listen(process.env.PORT);
