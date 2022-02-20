const {getRecipesByUserId} = require('../model/recipeModel.js');
module.exports = {
  getRecipes: async (_req, res) => {
    res.send(await getRecipesByUserId(res.locals.user.id));
  },
};
