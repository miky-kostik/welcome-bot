require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const WELCOME_CHANNEL_NAME = '👋-welcome';

client.once('clientReady', () => {
    console.log(`Bot je přihlášený jako ${client.user.tag}`);
});

async function sendWelcomeMessage(member) {
    try {
        const channel = member.guild.channels.cache.find(
            (ch) => ch.name === WELCOME_CHANNEL_NAME
        );

        if (!channel) return;

        const imageBuffer = await createWelcomeImage(member.user.username);

        await channel.send({
            files: [{ attachment: imageBuffer, name: 'welcome.png' }],
        });
    } catch (error) {
        console.error(error);
    }
}

async function createWelcomeImage(username) {
    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('./assets/background.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';

    ctx.font = 'bold 90px sans-serif';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText('WELCOME', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('WELCOME', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = 'bold 50px sans-serif';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(username, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(username, canvas.width / 2, canvas.height / 2 + 50);

    return canvas.toBuffer();
}

client.on('guildMemberAdd', (member) => {
    if (!member.pending) {
        sendWelcomeMessage(member);
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.pending && !newMember.pending) {
        sendWelcomeMessage(newMember);
    }
});

client.on('messageCreate', (message) => {
    console.log(`Zpráva přijata: "${message.content}" od ${message.author.tag}`);
    if (message.content === '!testwelcome') {
        console.log('Spouštím testwelcome...');
        sendWelcomeMessage(message.member);
    }
});

client.login(process.env.DISCORD_TOKEN);

const express = require('express');
const app = express();
app.disable('x-powered-by');
app.get('/', (req, res) => res.send('Bot běží!'));
app.listen(process.env.PORT || 3000, () => {
    console.log('Webserver pro Railway spuštěn.');
});