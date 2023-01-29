const Sequelize = require('sequelize');
// Load models: GCS Tool
const UserModel = require('./models/user');

// Connect to DB: GCS Tool
const sequelize = new Sequelize('gcs', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

// Attach DB to model: GCS Tool
const User = UserModel(sequelize, Sequelize);
const Op = Sequelize.Op;

// Create all necessary tables: GCS Tool
sequelize.sync().then(() => {
  console.log(`Database & tables syncronized! [GCS Tool]`);
});

// Export models
module.exports = {
  User,
  Op,
};
