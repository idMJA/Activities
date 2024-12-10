const { verifyKey } = require('discord-interactions');
const { Application } = require('interactions.js');
require('dotenv').config();

const client = new Application({
  botToken: process.env.TOKEN,
  publicKey: process.env.PUBLICKEY,
  applicationId: process.env.APPLICATIONID,
});

require('../src/util/httpClient')(client);

const verifyDiscordRequest = (clientPublicKey) => {
  return function(req, res, buf) {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    
    const isValidRequest = verifyKey(buf, signature, timestamp, clientPublicKey);
    if (!isValidRequest) {
      res.status(401).send('Invalid request signature');
      throw new Error('Invalid request signature');
    }
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const rawBody = JSON.stringify(req.body);
    verifyDiscordRequest(process.env.PUBLICKEY)(
      { headers: req.headers, body: rawBody },
      res,
      Buffer.from(rawBody)
    );
  } catch (err) {
    return res.status(401).send('Invalid request signature');
  }

  const interaction = req.body;

  try {
    if (interaction.type === 1) { // PING
      return res.status(200).send({ type: 1 });
    }

    // Handle other interaction types here...

    return res.status(200).send({ type: 1 });
  } catch (error) {
    console.error('Error handling interaction:', error);
    return res.status(500).send('Internal server error');
  }
}; 
