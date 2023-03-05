const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const checkPlagiarism = async (user, interaction) => {
  try {
    const input = interaction.options.getString("text");
    await interaction.deferReply({
      ephemeral: true,
    });
    let result = "";
    const paragraphArr = input.split("  ");
    // Split input by new line then check plagiarism
    await paragraphArr.map(async (paragraph, i) => {
      const response = await axios.get(process.env.PARAPHRASE_URL, {
        params: {
          payload: `{"input":"${paragraph}","serverId":1,"route":"check-plagiarism","extra":null}`,
        },
      });

      result += response.data.output + "\n\n";

      if (i === paragraphArr.length - 1) {
        const embeddedMessage = new EmbedBuilder()
          .setTitle("Plagiarism Checking Result")
          .setAuthor({
            name: user.username,
            iconURL: user.defaultAvatarURL,
          })
          .setColor("DarkOrange")
          .setDescription(result);

        await interaction.editReply({
          embeds: [embeddedMessage],
        });
      }
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error.message);
    }
  }
};

module.exports = checkPlagiarism;
