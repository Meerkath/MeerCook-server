const fs = require('fs')
const path = require('path')
const {getRecipesByUserId} = require('../model/recipeModel.js')

module.exports = {
  getRecipes: async (_req, res) => {
    res.send(await getRecipesByUserId(res.locals.user.id))
  },
  getImage: async (req, res) => {
    if (!req.params.imgId) {
      res.status(400)
        .send('Please provide imgId attribute.'); return
    }
    // eslint-disable-next-line max-len
    const imgPath = path.join(__dirname, '../images', `${res.locals.user.id}_${req.params.imgId}.jpg`)
    console.log(imgPath)
    try {
      if (!fs.existsSync(imgPath)) {
        res.status(404).send('Image not found.'); return
      }
      res.sendFile(imgPath)
    } catch (err) {
      throw new Error('Error while getting image.', err)
    }
  },
}
