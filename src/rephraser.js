const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const rephrase = async (user, interaction) => {
  try {
    const input = interaction.options.getString("text");
    await interaction.deferReply({
      ephemeral: false,
    });
    const payload = {
      operationName: "RephraseTextsForDocumentEditor",
      query: process.env.REPHRASER_QUERY,
      variables: {
        annotations: [],
        brief: {},
        debugAcPrompt: null,
        generationTool: "basic_content_improver",
        keywords: "",
        language: "en-us",
        numberOfVariations: 3,
        onlyImproveScore: false,
        productName: "",
        projectId: 3429168,
        recomposeMode: "relaxed",
        scoringMethod: {
          id: 697,
          type: "ContentTaxonomy",
        },
        text: input,
      },
    };
    const response = await axios.post(process.env.REPHRASER_URL, payload, {
      headers: {
        "x-access-token": process.env.REPHRASER_TOKEN,
      },
    });
    const variations =
      response.data.data.rephraseTextsForDocumentEditor.variations;
    let description = "";
    variations.map((el, i) => {
      description += `Result ${i + 1}: \n` + el.copyText + "\n\n";
    });

    const embeddedMessage = new EmbedBuilder()
      .setTitle("Rephraser Results")
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(description);

    await interaction.editReply({
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

module.exports = rephrase;
