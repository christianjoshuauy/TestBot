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
    const model = interaction.options
      ? interaction.options.getString("model")
      : "gpt-3.5-turbo";
    interaction.deferReply({ ephemeral: false });
    const response = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
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
      .setDescription(response.data.choices[0].message.content);

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
