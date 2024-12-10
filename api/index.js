const { verifyKey } = require('discord-interactions');
const { Application } = require('interactions.js');
const config = require('../src/config');

const client = new Application({
  botToken: config.secret.token,
  publicKey: config.secret.publicKey,
  applicationId: config.secret.applicationId,
});

// Load commands
require('../src/util/httpClient')(client);

async function verifyDiscordRequest(req, res) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = JSON.stringify(req.body);

  const isValidRequest = verifyKey(
    Buffer.from(body),
    signature,
    timestamp,
    config.secret.publicKey
  );

  if (!isValidRequest) {
    res.status(401).send('Invalid request signature');
    return false;
  }

  return true;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  // Verify the request
  const isValid = await verifyDiscordRequest(req, res);
  if (!isValid) return;

  const interaction = req.body;

  try {
    // Handle different interaction types
    if (interaction.type === 2) { // COMMAND
      const command = client.commands.get(interaction.data.name);
      if (!command) {
        return res.status(400).send('Unknown command');
      }
      
      await command.execute(interaction, client);
    } 
    else if (interaction.type === 3 && interaction.data.component_type === 2) { // BUTTON
      const command = client.commands.get("report");
      if (command.buttonHandler) {
        await command.buttonHandler(interaction, client);
      }
    }
    else if (interaction.type === 5) { // MODAL
      const command = client.commands.get("report");
      if (command.modalHandler) {
        await command.modalHandler(interaction, client);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling interaction:', error);
    return res.status(500).send('Internal server error');
  }
}; 