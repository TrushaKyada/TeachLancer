require('dotenv').config();

let CONFIG = {}; //Make this global to use all over the application

CONFIG.email = process.env.EMAIL || "0083.work@gmail.com";
CONFIG.password = process.env.PASSWORD || "izlsnoyieiqtaray";

module.exports = CONFIG;