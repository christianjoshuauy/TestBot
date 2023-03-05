const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const chatAI = async (user, interaction, openai, opt) => {
  try {
    const input = interaction.options
      ? interaction.options.getString("prompt")
      : opt;
    interaction.deferReply({ ephemeral: false });
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      max_tokens: 4000,
    });

    const rowButtons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("reg_response")
        .setLabel("Regenerate Response")
        .setStyle(ButtonStyle.Success),
    ]);

    const embeddedMessage = new EmbedBuilder()
      .setTitle(input)
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(response.data.choices[0].text);

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

module.exports = chatAI;
