const {getUserByEmailOrUsername} = require('../model/userModel');
const {generateAccessToken} = require('./auth');
const utils = require('./utils');

module.exports = {
  login: async (req, res) => {
    if (!req.body.emailOrUsername) {
      res.status(400).send('Please provide emailOrUserName attribute.'); return;
    }
    if (!req.body.password) {
      res.status(400).send('Please provide password attribute.'); return;
    }
    const user = await getUserByEmailOrUsername(req.body.emailOrUsername);
    if (!user) {
      res.status(404).send('This email or username doesn\'t exists.');
      return;
    }
    if (utils.hashPassword(req.body.password) === user.password) {
      user.password = undefined;
      res.status(200).send({
        user,
        accessToken: generateAccessToken(user),
      });
    } else {
      res.status(403).send('Incorrect password.');
    }
  },
};

