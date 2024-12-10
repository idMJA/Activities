const { readdirSync } = require('fs');
const config = require('../config');
module.exports = async (client) => {
  client.commands.clear();
  
  const commandFiles = readdirSync('./src/commands/')
    .filter((file) => file.endsWith('.js'));

  const commands = [];

  for (const file of commandFiles) {
    delete require.cache[require.resolve(`../commands/${file}`)];
    
    const command = require(`../commands/${file}`);
    commands.push(command);
    client.commands.set(command.name, command);
  }

  if (config.secret.status === 'PRODUCTION') {
    client.setAppCommands(commands)
      .catch(console.log);
  } else {
    client.setGuildCommands(commands, config.secret.guildId)
      .catch(console.log);

    console.log('Activities > Successfully registered commands locally');
  }
  
  console.log(`Activities > Successfully reloaded ${commands.length} commands`);
};
