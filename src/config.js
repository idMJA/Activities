require('dotenv').config();

module.exports = {
    // Bot Configuration
    bot: {
        name: "Activities",
        version: "0.0.1",
        description: "I can launch activities to play games, listen to music and more!",
        icon: "https://i.ibb.co.com/yNXP0t4/discotools-xyz-icon-3.png",
        reportChannelId: "1274678223694987335"
    },

    secret: {
        status: "PRODUCTION", // PRODUCTION or DEVELOPMENT
        token: process.env.TOKEN,
        applicationId: process.env.APPLICATIONID,
        publicKey: process.env.PUBLICKEY,
        guildId: process.env.GUILDID
    },

    // Embed Colors
    colors: {
        primary: "#5865f2",    // Discord Blurple
        success: "#57F287",    // Green
        error: "#ED4245",      // Red
        warning: "#FEE75C"     // Yellow
    },

    // Emojis
    emojis: {
        arrow: "<:arrow:1273617674403971185>",
        party: "<:party:1281910663303925800>",
        news: "<:news:1273617723334852660>",
        info: "<:info:1273617713247555625>",
        activity: "<:activity:1273617733321494558>",
        utils: "<:utils:1273617703248199680>",
        party: "<:party:1315947330020708392>",
        plane: "<:plane:1315947330020708392>",
        link: "<:link:1315947330020708392>",
        slash: "<:slash:1315947330020708392>",
        home: "<:home:1315947330020708392>"
    },

    // News & Updates
    news: {
        latest: [
            "Change bot code from \“Gateaway\” to \“HTTP\”"
        ]
    },

    // Links & URLs
    urls: {
        invite: "https://discord.com/oauth2/authorize?client_id=1281910663303925800&permissions=1&scope=applications.commands%20bot",
        support: "https://discord.gg/pTbFUFdppU"
    },

    // Footer Text
    footer: "© Tronix Development Team"
};