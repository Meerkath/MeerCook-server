const {getConnection} = require('./dbConnect.js');

module.exports = {
  getRecipesByUserId: async (userId) => {
    const connection = await getConnection();
    const [recipes] = await connection.execute(
        'SELECT * FROM recipe WHERE userId = ?',
        [userId],
    );
    return recipes;
  },
};
