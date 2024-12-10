const config = require('../config');

module.exports = {
  async createInvite(channelId, appId) {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/invites`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${config.secret.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Activities'
      },
      body: JSON.stringify({
        max_age: 900,
        max_uses: 0,
        unique: true,
        target_type: 2,
        target_application_id: appId
      })
    });

    const data = await response.json();
    return data;
  }
};