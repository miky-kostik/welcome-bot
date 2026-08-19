require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// ⚠️ UPRAV TOHLE PODLE SVÉHO SERVERU:
const WELCOME_CHANNEL_NAME = '👋-welcome';
const BACKGROUND_IMAGE_PATH = './assets/background.png';

client.once('clientReady', () => {
    console.log(`Bot je přihlášený jako ${client.user.tag}`);
});

async function sendWelcomeMessage(member) {
    try {
        const channel = member.guild.channels.cache.find(
            (ch) => ch.name === WELCOME_CHANNEL_NAME
        );

        if (!channel) {
            console.log(`Kanál "${WELCOME_CHANNEL_NAME}" nenalezen.`);
            return;
        }

        const attachment = new AttachmentBuilder(BACKGROUND_IMAGE_PATH, { name: 'welcome.png' });

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('Welcome')
            .setDescription(`${member} just joined the server!`)
            .setImage('attachment://welcome.png')
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        await channel.send({ embeds: [embed], files: [attachment] });
    } catch (error) {
        console.error(error);
    }
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
    if (message.content === '!testwelcome') {
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