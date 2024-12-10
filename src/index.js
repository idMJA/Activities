const { Application } = require('interactions.js');
const config = require('./config');

/* Initialize client */
const client = new Application({
  botToken: config.secret.token,
  publicKey: config.secret.publicKey,
  applicationId: config.secret.applicationId,
});

// Start the client and initialize components
client.start()
  .then(() => {
    console.log("Client Started");
    require('./util/httpClient')(client);
  })
  .catch(console.error);

// Optional: Add debug logging
client.on("debug", debug => console.log(debug));

client.on("interactionCreate", async (interaction) => {
  // Command handler
  if (interaction.type === 2) { // COMMAND
    const command = client.commands.get(interaction.data.name);
    if (!command) return;
    
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error executing this command!", ephemeral: true });
    }
  }
  
  // Button handler
  if (interaction.type === 3 && interaction.data.component_type === 2) { // BUTTON
    const command = client.commands.get("report"); // karena ini khusus untuk command report
    if (command.buttonHandler) {
      await command.buttonHandler(interaction, client);
    }
  }
  
  // Modal handler
  if (interaction.type === 5) { // MODAL_SUBMIT
    const command = client.commands.get("report"); // karena ini khusus untuk command report
    if (command.modalHandler) {
      await command.modalHandler(interaction, client);
    }
  }
});
