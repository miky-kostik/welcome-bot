const {
    Client,
    GatewayIntentBits,
    Events,
    AttachmentBuilder,
    ChannelType
} = require("discord.js");

const {
    createCanvas,
    loadImage,
    GlobalFonts
} = require("@napi-rs/canvas");

const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// ==============================
// NASTAVENÍ
// ==============================

const WELCOME_CHANNEL_ID = "1539596108764807288";

const BACKGROUND_PATH = path.join(
    __dirname,
    "assets",
    "background.png"
);

const FONT_PATH = path.join(
    __dirname,
    "assets",
    "Roboto_Condensed-Bold.ttf"
);

// ==============================
// FONT
// ==============================

try {
    const registered = GlobalFonts.registerFromPath(
        FONT_PATH,
        "Roboto"
    );

    if (registered) {
        console.log("✅ Font Roboto byl načten.");
    } else {
        console.log("⚠️ Font Roboto se nepodařilo načíst.");
    }
} catch (error) {
    console.error("❌ Chyba při načítání fontu:", error);
}

// ==============================
// DISCORD CLIENT
// ==============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ==============================
// BOT READY
// ==============================

client.once(Events.ClientReady, (bot) => {
    console.log("--------------------------------");
    console.log(`✅ Bot je online: ${bot.user.tag}`);
    console.log(`📢 Welcome channel: ${WELCOME_CHANNEL_ID}`);
    console.log("--------------------------------");
});

// ==============================
// NOVÝ ČLEN
// ==============================

client.on(Events.GuildMemberAdd, async (member) => {

    console.log(
        `👤 Nový člen: ${member.user.tag}`
    );

    try {

        // ------------------------------
        // NAJDE WELCOME KANÁL
        // ------------------------------

        const channel = await member.guild.channels.fetch(
            WELCOME_CHANNEL_ID
        );

        if (!channel) {
            console.error(
                "❌ Welcome kanál nebyl nalezen!"
            );
            return;
        }

        if (!channel.isTextBased()) {
            console.error(
                "❌ Zadaný kanál není textový kanál!"
            );
            return;
        }

        // ------------------------------
        // NAČTE POZADÍ
        // ------------------------------

        const background = await loadImage(
            BACKGROUND_PATH
        );

        console.log(
            `🖼️ Background: ${background.width}x${background.height}`
        );

        // Canvas bude mít stejnou velikost jako background
        const canvas = createCanvas(
            background.width,
            background.height
        );

        const ctx = canvas.getContext("2d");

        // ------------------------------
        // BACKGROUND
        // ------------------------------

        ctx.drawImage(
            background,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // ------------------------------
        // WELCOME
        // ------------------------------

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 60px Roboto";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "WELCOME",
            canvas.width / 2,
            80
        );

        // ------------------------------
        // USERNAME
        // ------------------------------

        ctx.font = "bold 42px Roboto";

        ctx.fillText(
            member.user.username,
            canvas.width / 2,
            145
        );

        // ------------------------------
        // MEMBER COUNT
        // ------------------------------

        ctx.font = "bold 25px Roboto";

        ctx.fillText(
            `Member #${member.guild.memberCount}`,
            canvas.width / 2,
            190
        );

        // ------------------------------
        // AVATAR
        // ------------------------------

        const avatarURL = member.user.displayAvatarURL({
            extension: "png",
            size: 256
        });

        const avatar = await loadImage(
            avatarURL
        );

        // Velikost avataru
        const avatarSize = 170;

        // Střed avataru
        const avatarX =
            canvas.width / 2 - avatarSize / 2;

        const avatarY =
            canvas.height - avatarSize - 45;

        // KULATÝ AVATAR
        ctx.save();

        ctx.beginPath();

        ctx.arc(
            canvas.width / 2,
            avatarY + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2
        );

        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            avatar,
            avatarX,
            avatarY,
            avatarSize,
            avatarSize
        );

        ctx.restore();

        // ------------------------------
        // PNG
        // ------------------------------

        const imageBuffer = await canvas.encode(
            "png"
        );

        const attachment = new AttachmentBuilder(
            imageBuffer,
            {
                name: "welcome.png"
            }
        );

        // ------------------------------
        // ODESLÁNÍ
        // ------------------------------

        await channel.send({
            content: `👋 Vítej na serveru, ${member}!`,
            files: [attachment]
        });

        console.log(
            `✅ Welcome zpráva odeslána pro ${member.user.tag}`
        );

    } catch (error) {

        console.error(
            "❌ CHYBA PŘI WELCOME:",
            error
        );

    }
});

// ==============================
// ERROR HANDLING
// ==============================

client.on("error", (error) => {
    console.error(
        "❌ Discord client error:",
        error
    );
});

process.on("unhandledRejection", (error) => {
    console.error(
        "❌ Unhandled rejection:",
        error
    );
});

// ==============================
// LOGIN
// ==============================

if (!process.env.TOKEN) {
    console.error(
        "❌ V .env chybí TOKEN!"
    );
    process.exit(1);
}

client.login(process.env.TOKEN);