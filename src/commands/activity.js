const { Embed, Button, ActionRow } = require("interactions.js");
const { createInvite } = require("../util/functions");
const activities = require("../util/activities");
const config = require("../config");

module.exports = {
  name: "activity",
  description: "Join the fun with Discord Together Activities!",
  options: [
    {
      name: "type", 
      description: "Select an activity",
      type: 3, // STRING
      required: true,
      choices: activities
    },
    {
      name: "channel",
      description: "Select a voice channel", 
      type: 7, // CHANNEL
      required: true,
      channel_types: [2]
    }
  ],
  async execute(interaction, client) {
    try {
      const channel = interaction.data.options.find(opt => opt.name === "channel");
      const activityType = interaction.data.options.find(opt => opt.name === "type");
      
      const invite = await createInvite(channel.value, activityType.value);
      
      if (!invite.code) {
        return interaction.editReply({
          content: "An error occurred while creating the activity!",
          ephemeral: true
        });
      }

      // Hitung waktu expired (15 menit dari sekarang)
      const expiresAt = Math.floor(Date.now() / 1000) + 900; // 900 detik = 15 menit

      const activityEmbed = new Embed()
        .setColor(config.colors.primary)
        .setTitle(`${config.emojis.activity} Activities`)
        .setDescription(`**Click the button below to join the activity!**\n\n**Enjoy your activity!**\n\nInvite expires at: <t:${expiresAt}:R>`)
        .setFooter(config.footer);

      const joinButton = new Button()
        .setLabel("Join Activity")
        .setStyle(5)
        .setURL(`https://discord.gg/${invite.code}`)

      const row = new ActionRow().addComponents([joinButton]);

      return interaction.editReply({
        embeds: [activityEmbed],
        components: [row]
      });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while creating the activity!",
        ephemeral: true
      });
    }
  }
};
