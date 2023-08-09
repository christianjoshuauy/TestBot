const {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  REST,
  Routes,
  EmbedBuilder,
} = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { imageAI, imageAIVariation } = require("./src/imageAI");
const commands = require("./src/commands");
const chatAI = require("./src/chatAI");
const detectAI = require("./src/detectorAI");
const checkPlagiarism = require("./src/plagiarismChecker");
const { simplify } = require("./src/rephraser");
const { unlock, rephrase } = require("./src/unlocker");
const { reminder, terminate } = require("./src/reminder");
const { isTerminated } = require("./src/utils");
const fs = require("fs").promises;
require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

// Deploy the commands
async function refreshCommands() {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_APPLICATION_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

refreshCommands();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Connect to the Discord API using your bot token
client.login(process.env.DISCORD_BOT_TOKEN);

// Wait for the bot to be ready
client.on(Events.ClientReady, async () => {
  let reminders = [];
  if (
    await fs
      .access("src/json/reminders.json")
      .then(() => true)
      .catch(() => false)
  ) {
    reminders = JSON.parse(await fs.readFile("src/json/reminders.json"));
  }

  for (let i = 0; i < reminders.length; i++) {
    if (!(await isTerminated(reminders[i].title))) {
      console.log(reminders[i].title);
      reminder(client.user, null, client, reminders[i]);
    }
  }
  console.log(`Logged in as ${client.user.tag}!`);
});

const errorHandle = (interaction) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle("Error 304")
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.defaultAvatarURL,
    })
    .setColor("DarkOrange")
    .setDescription("Wrong Channel Error");
  interaction.reply({
    embeds: [embeddedMessage],
    ephemeral: true,
  });
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.channel.name === "image-ai") {
    if (interaction.commandName === "changpt-image") {
      await imageAI(client.user, interaction, openai);
    } else if (interaction.commandName === "changpt-image-variation") {
      await imageAIVariation(client.user, interaction, openai);
    } else {
      errorHandle(interaction);
    }
  } else if (interaction.channel.name === "chatgpt") {
    if (interaction.commandName === "changpt-ask") {
      await chatAI(client.user, interaction, openai);
    } else if (interaction.customId === "reg_response") {
      await chatAI(
        client.user,
        interaction,
        openai,
        interaction.message.embeds[0].data.title
      );
    } else {
      errorHandle(interaction);
    }
  } else if (interaction.channel.name === "ai-detection") {
    if (interaction.commandName === "detect") {
      await detectAI(client.user, interaction);
    } else {
      errorHandle(interaction);
    }
  } else if (interaction.channel.name === "plagiarism-checker") {
    if (interaction.commandName === "check-plagiarism") {
      await checkPlagiarism(client.user, interaction);
    }
  } else if (interaction.channel.name === "writing-tools") {
    if (interaction.commandName === "rephrase") {
      await rephrase(client.user, interaction);
    }
    if (interaction.commandName === "simplify") {
      await simplify(client.user, interaction);
    } else {
      errorHandle(interaction);
    }
  } else if (interaction.channel.name === "unlocker") {
    if (interaction.commandName === "unlock") {
      await unlock(client.user, interaction);
    } else {
      errorHandle(interaction);
    }
  } else if (interaction.channel.name === "reminders") {
    if (interaction.commandName === "remind") {
      await reminder(client.user, interaction, client);
    } else if (interaction.commandName === "terminate") {
      await terminate(client.user, interaction);
    } else {
      errorHandle(interaction);
    }
  }
});
