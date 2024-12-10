require('dotenv').config();

module.exports = (client) => {
  /* Load event handlers */
  require('./eventLoader')(client);

  /* Initialize commands collection */
  client.commands = new Map();
};
