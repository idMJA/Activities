const { verifyKey } = require('discord-interactions');
const { Application } = require('interactions.js');
const config = require('../config');

const client = new Application({
  botToken: config.secret.token,
  publicKey: config.secret.publicKey,
  applicationId: config.secret.applicationId,
});

// Initialize the client
require('../src/util/httpClient')(client);

// Verify Discord requests middleware
const verifyDiscordRequest = (clientPublicKey) => {
  return function(req, res, buf) {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    
    const isValidRequest = verifyKey(buf, signature, timestamp, clientPublicKey);
    if (!isValidRequest) {
      throw new Error('Invalid request signature');
    }
  }
};

module.exports = async (req, res) => {
  // Verify the request is from Discord
  try {
    const rawBody = JSON.stringify(req.body);
    verifyDiscordRequest(process.env.PUBLICKEY)(
      { headers: req.headers, body: rawBody },
      res,
      Buffer.from(rawBody)
    );
  } catch (err) {
    return res.status(401).send({ error: 'Invalid request signature' });
  }

  // Handle the interaction
  const interaction = req.body;

  try {
    // Command handler
    if (interaction.type === 2) { // COMMAND
      const command = client.commands.get(interaction.data.name);
      if (!command) return res.status(404).send({ error: 'Command not found' });
      
      await command.execute(interaction, client);
    }
    
    // Button handler
    if (interaction.type === 3 && interaction.data.component_type === 2) { // BUTTON
      const command = client.commands.get("report");
      if (command.buttonHandler) {
        await command.buttonHandler(interaction, client);
      }
    }
    
    // Modal handler
    if (interaction.type === 5) { // MODAL_SUBMIT
      const command = client.commands.get("report");
      if (command.modalHandler) {
        await command.modalHandler(interaction, client);
      }
    }

    return res.status(200).send({ type: 1 });
  } catch (error) {
    console.error('Error handling interaction:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
}; 