require('dotenv').config(); 
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         
    GatewayIntentBits.GuildMembers,  
  ],
});


client.once('ready', () => {
  console.log(`Bot je přihlášený jako ${client.user.tag}`);
});

client.on('guildMemberAdd', (member) => {
 
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === '👋-welcome'
  );

  if (!channel) {
    console.log('Uvítací kanál nebyl nalezen.');
    return;
  }

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('Vítej na serveru! 👋')
    .setDescription(`Ahoj ${member}, jsme rádi, že jsi tu!`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.DISCORD_TOKEN);