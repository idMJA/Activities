const { Modal, TextInput, ActionRow, Embed, Button } = require("interactions.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require("../config");

// Validasi config
if (!config.bot.reportChannelId) {
  throw new Error("Report channel ID is not configured! Please add 'reportChannelId' to your config file.");
}

// Create modal outside to be reusable
const createReportModal = (type) => {
  const reportModal = new Modal()
    .setCustomId(`${type}_report`)
    .setTitle(type === 'bug' ? 'Bug Report' : 'Feature Request');

  const descriptionInput = new TextInput()
    .setCustomId("description")
    .setLabel(type === 'bug' ? "Describe the bug" : "Describe the feature")
    .setStyle(2) // Paragraph style
    .setPlaceholder(type === 'bug' ? 
      "Please describe the bug in detail..." : 
      "Please describe the feature you'd like to see...")
    .setRequired(true);

  const modalActionRow = new ActionRow().addComponents([descriptionInput]);
  reportModal.addComponents([modalActionRow]);
  
  return reportModal;
};

module.exports = {
  name: "report",
  description: "Report a bug or request a feature",
  async execute(interaction, client) {
    try {
      const bugButton = new Button()
        .setCustomId("bug_report_modal")
        .setLabel("Report Bug")
        .setStyle(1); // Primary (Blue)

      const featureButton = new Button()
        .setCustomId("feature_report_modal")
        .setLabel("Request Feature")
        .setStyle(2); // Secondary (Grey)

      const buttonRow = new ActionRow().addComponents([bugButton, featureButton]);

      await interaction.reply({
        content: "Please select what you would like to do:",
        components: [buttonRow],
      });

    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "An error occurred while processing your request!",
        ephemeral: true
      });
    }
  },

  async buttonHandler(interaction, client) {
    try {
      if (interaction.data.custom_id === "bug_report_modal") {
        const modal = createReportModal('bug');
        await interaction.showModal(modal);
      } else if (interaction.data.custom_id === "feature_report_modal") {
        const modal = createReportModal('feature');
        await interaction.showModal(modal);
      }
    } catch (error) {
      console.error("Error in button handler:", error);
      await interaction.reply({ 
        content: "Failed to show the report form. Please try again.", 
        ephemeral: true 
      });
    }
  },

  async modalHandler(interaction, client) {
    const type = interaction.customId.split('_')[0]; // 'bug' or 'feature'
    const description = interaction.data.components[0].components[0].value;

    const reportEmbed = new Embed()
      .setColor(type === 'bug' ? config.colors?.error || "#ff0000" : config.colors?.success || "#00ff00")
      .setTitle(type === 'bug' ? "New Bug Report" : "New Feature Request")
      .setDescription(description)
      .setFooter(`Reported by ${interaction.user.tag}`);

    try {
      if (!config.bot.reportChannelId) {
        throw new Error("Report channel ID is not configured!");
      }

      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || config.token);

      await rest.post(
        Routes.channelMessages(config.bot.reportChannelId),
        { body: { embeds: [reportEmbed] } }
      );

      // Delete the original message
      await interaction.deleteReply();
    } catch (error) {
      console.error("Failed to send report:", error);
      await interaction.update({ 
        content: [
          "❌ Error: Could not send the report.",
          "",
          "Please make sure:",
          "• The report channel is properly configured",
          "• The bot has permission to send messages in the report channel",
          "",
          "If the problem persists, please contact the bot developers."
        ].join("\n"), 
        components: [] // Remove buttons
      });
    }
  }
};
