require('dotenv').config();

let CONFIG = {}; //Make this global to use all over the application

CONFIG.email = process.env.EMAIL;
CONFIG.password = process.env.PASSWORD;

module.exports = CONFIG;
