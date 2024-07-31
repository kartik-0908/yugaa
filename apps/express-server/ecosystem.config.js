const dotenv = require('dotenv');
const env = dotenv.config().parsed;

module.exports = {
  apps: [{
    name: "yugaa-express",
    script: "index.js",
    env: env
  }]
};