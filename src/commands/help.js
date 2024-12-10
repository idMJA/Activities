const { Embed, Button, ActionRow } = require("interactions.js");
const config = require("../config");

module.exports = {
  name: "help",
  description: "Show all available commands",
  async execute(interaction, client) {
    try {
      // Combined help embed
      const helpEmbed = new Embed()
        .setColor("#5865f4")
        .setTitle("Help!")
        .setDescription(`Hello, I'm **${config.bot.name}**`)
        .addFields([
          {
            name: `${config.emojis.news} News`,
            value: [
              `> ${config.emojis.arrow} ${config.news.latest[0]}`,
              `> ${config.emojis.arrow} If an error occurs or you want to request a new activity, you can use the command \`/report\``
            ].join("\n"),
            inline: false
          },
          {
            name: "Available Commands",
            value: "Here are all available commands:",
            inline: false
          },
          {
            name: "/activity",
            value: "```js\nStart Discord Together activities```"
          },
          {
            name: "/help", 
            value: "```js\nShow this help menu```"
          },
          {
            name: "/invite",
            value: "```js\nGet bot invite link```"
          },
          {
            name: "/ping",
            value: "```js\nCheck bot latency```"
          }
        ])
        .setFooter(config.footer);

      // Send combined help embed
      await interaction.editReply({
        embeds: [helpEmbed]
      });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while showing help menu!",
        ephemeral: true
      });
    }
  }
};
