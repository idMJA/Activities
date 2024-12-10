const { Application } = require('interactions.js');
const { verifyKey } = require('discord-interactions');
const config = require('./config');

/* Initialize client */
const client = new Application({
  botToken: config.secret.token,
  publicKey: config.secret.publicKey,
  applicationId: config.secret.applicationId,
});

// Verification middleware
const verifyDiscordRequest = (clientPublicKey) => {
  return function(req, res, buf) {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    
    try {
      const isValidRequest = verifyKey(buf, signature, timestamp, clientPublicKey);
      if (!isValidRequest) {
        throw new Error('Invalid request signature');
      }
    } catch (err) {
      res.status(401).send('Invalid request signature');
      throw new Error('Invalid request signature');
    }
  }
};

// Start the client and initialize components
client.start({
  verifyMiddleware: verifyDiscordRequest(config.secret.publicKey)
})
.then(() => {
  console.log("Client Started");
  require('./util/httpClient')(client);
})
.catch(console.error);

client.on("debug", debug => console.log(debug));

client.on("interactionCreate", async (interaction) => {
  // Immediately acknowledge the interaction
  await interaction.deferReply().catch(console.error);
  
  try {
    // Command handler
    if (interaction.type === 2) { // COMMAND
      const command = client.commands.get(interaction.data.name);
      if (!command) return;
      
      // Execute command with timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Command timed out')), 2500);
      });
      
      await Promise.race([
        command.execute(interaction, client),
        timeoutPromise
      ]);
    }
    
    // Button handler
    if (interaction.type === 3 && interaction.data.component_type === 2) {
      const command = client.commands.get("report");
      if (command.buttonHandler) {
        await command.buttonHandler(interaction, client);
      }
    }
    
    // Modal handler
    if (interaction.type === 5) {
      const command = client.commands.get("report");
      if (command.modalHandler) {
        await command.modalHandler(interaction, client);
      }
    }
  } catch (error) {
    console.error(error);
    // Send error response if we haven't responded yet
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply({ 
        content: "An error occurred while processing your request. Please try again.",
        ephemeral: true 
      });
    } else {
      await interaction.editReply({
        content: "An error occurred while processing your request. Please try again.",
        ephemeral: true
      });
    }
  }
});
