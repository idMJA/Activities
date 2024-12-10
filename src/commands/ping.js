const { Embed } = require("interactions.js");

module.exports = {
  name: "ping",
  description: "Check bot latency",
  async execute(interaction, client) {
    try {
      const start = Date.now();
      
      await interaction.editReply({
        content: "Pinging..."
      });

      const end = Date.now();
      const ping = end - start;

      const pingEmbed = new Embed()
        .setColor(config.colors.primary)
        .setTitle(`${config.emojis.info} Pong!`)
        .setDescription(`\`\`\`fix\n${ping}ms\`\`\``)
        .setFooter(config.footer);

      return interaction.editReply({
        content: null,
        embeds: [pingEmbed]
      });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while checking latency!",
        ephemeral: true
      });
    }
  }
};
