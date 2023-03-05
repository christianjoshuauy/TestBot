const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const { urlToBuffer } = require("./utils");

const imageAI = async (user, interaction, openai) => {
  try {
    const input = interaction.options.getString("prompt");
    interaction.deferReply({ ephemeral: true });
    const response = await openai.createImage({
      prompt: input,
      n: 1,
      size: "1024x1024",
    });

    const rowButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("upgrade_image")
        .setLabel("Upgrade")
        .setStyle(ButtonStyle.Success)
    );

    const embeddedMessage = new EmbedBuilder()
      .setTitle(input)
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setImage(response.data.data[0].url);

    interaction.editReply({
      embeds: [embeddedMessage],
      components: [rowButtons],
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error.message);
    }
  }
};

const imageAIVariation = async (
  user,
  interaction,
  openai,
  isUpgrade = false
) => {
  try {
    const input = isUpgrade
      ? interaction.message.embeds[0].data.image.url
      : interaction.options.getAttachment("image");

    if (isUpgrade) {
      console.log(interaction.message.embeds[0].data.image.url);
    }

    interaction.deferReply({ ephemeral: true });
    const response = await openai.createImageVariation(
      fs.createReadStream(await urlToBuffer(input.url)),
      4,
      "1024x1024"
    );

    const embeddedMessage = [
      new EmbedBuilder()
        .setTitle("Variations")
        .setAuthor({
          name: user.username,
          iconURL: user.defaultAvatarURL,
        })
        .setColor("DarkOrange")
        .setDescription("Here are some variations of your given image.")
        .setURL("https://example.org/"),
    ];

    response.data.data.forEach((img) => {
      embeddedMessage.push(
        new EmbedBuilder().setURL("https://example.org/").setImage(img.url)
      );
    });

    interaction.editReply({
      embeds: [...embeddedMessage],
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error.message);
    }
  }
};

module.exports = { imageAI, imageAIVariation };
