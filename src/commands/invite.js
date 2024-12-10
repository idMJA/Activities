const { Embed, Button, ActionRow } = require("interactions.js");
const config = require("../config");
module.exports = {
  name: "invite",
  description: "Invite the bot!",
  async execute(interaction, client) {
    try {
      const embed = new Embed()
        .setColor(config.colors.primary) // Blurple color
        .setTitle(`${config.emojis.paper} Invite`)
        .setDescription("Want to invite me to your server?\nClick the button below!");

      const inviteButton = new Button()
        .setStyle(5)
        .setLabel("Invite Me!")
        .setURL(config.urls.invite);

      const supportButton = new Button()
        .setStyle(5)
        .setLabel("Support Server")
        .setURL(config.urls.support);

      const row = new ActionRow().addComponents([inviteButton, supportButton]);

      return interaction.editReply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while generating the invite link!",
        ephemeral: true
      });
    }
  }
};
