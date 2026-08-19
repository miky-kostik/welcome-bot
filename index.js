require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('clientReady', () => {
    console.log(`Bot je přihlášený jako ${client.user.tag}`);
});

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === '🚪the-beggining'
    );

    if (!channel) return;

    channel.send(`Vítej na serveru, ${member}! 👋`);
});

client.login(process.env.DISCORD_TOKEN);

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot běží!'));
app.listen(process.env.PORT || 3000, () => {
    console.log('Webserver pro Railway spuštěn.');
});