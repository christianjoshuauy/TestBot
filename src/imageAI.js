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
    interaction.deferReply({ ephemeral: false });
    const response = await openai.createImage({
      prompt: input,
      n: 1,
      size: "512x512",
    });

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
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error.message);
    }
  }
};

const imageAIVariation = async (user, interaction, openai) => {
  try {
    const input = interaction.options.getAttachment("image");
    interaction.deferReply({ ephemeral: false });
    const response = await openai.createImageVariation(
      fs.createReadStream(await urlToBuffer(input.url)),
      4,
      "512x512"
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
