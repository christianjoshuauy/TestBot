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

const simplify = async (user, interaction) => {
  try {
    const input = interaction.options.getString("text");
    await interaction.deferReply({
      ephemeral: false,
    });
    const payload = {
      operationName: "SuggestDocumentVariations",
      query:
        "mutation SuggestDocumentVariations($projectId: ID!, $generationTool: GenerationToolEnum!, $brief: BriefInput!, $inputText: String, $scoringMethod: ScoringMethodInput, $suggestionMode: String!, $language: String!, $languageTargetFormality: LanguageTargetFormalityEnum, $numberOfVariations: Int!, $tov: String, $personalizedSamples: [String!], $personalizedName: String, $personalizedDescription: String, $debugAcPrompt: String, $freestyleToolId: ID, $freestyleToolAllInstructions: String, $customerPersonaId: ID, $customerPersona: CustomerPersonaInput, $annotations: [SuggestionAnnotationInput!], $sourceType: String, $manualInstructions: String, $avoidWords: [String!], $onlyImproveScore: Boolean, $originalVariationId: ID) {\n  suggestVariationsForDocumentEditor(\n    projectId: $projectId\n    generationTool: $generationTool\n    brief: $brief\n    inputText: $inputText\n    scoringMethod: $scoringMethod\n    suggestionMode: $suggestionMode\n    language: $language\n    languageTargetFormality: $languageTargetFormality\n    numberOfVariations: $numberOfVariations\n    tov: $tov\n    personalizedSamples: $personalizedSamples\n    personalizedName: $personalizedName\n    personalizedDescription: $personalizedDescription\n    debugAcPrompt: $debugAcPrompt\n    freestyleToolId: $freestyleToolId\n    freestyleToolAllInstructions: $freestyleToolAllInstructions\n    customerPersonaId: $customerPersonaId\n    customerPersona: $customerPersona\n    annotations: $annotations\n    sourceType: $sourceType\n    manualInstructions: $manualInstructions\n    avoidWords: $avoidWords\n    onlyImproveScore: $onlyImproveScore\n    originalVariationId: $originalVariationId\n  ) {\n    ...SuggestionRequest\n    __typename\n  }\n}\n\nfragment SuggestionRequest on SuggestionRequest {\n  id\n  generationTool\n  assetType\n  briefTitle\n  briefBody\n  emailPromotion\n  keywords\n  suggestionMode\n  link\n  inputText\n  originalVariationId\n  originalVariationScore\n  personalizedSamples\n  personalizedName\n  personalizedDescription\n  enterpriseModel {\n    id\n    title\n    __typename\n  }\n  enterpriseScoringModel {\n    id\n    title\n    __typename\n  }\n  tovId\n  tovTitle\n  suggestionAnnotationType\n  suggestionAnnotationContent\n  suggestionAnnotationMinAge\n  suggestionAnnotationMaxAge\n  language\n  languageTargetFormality\n  createdAt\n  contentTaxonomyId\n  freestyleToolId\n  freestyleToolAllInstructions\n  groupId\n  sourceType\n  generationGuidance {\n    keywords\n    campaignKeywords\n    features\n    benefits\n    pains\n    avatar\n    tov\n    genGuideFreeform\n    avoidWords\n    __typename\n  }\n  customerPersona {\n    ...CustomerPersona\n    __typename\n  }\n  variations {\n    ...Variation\n    __typename\n  }\n  __typename\n}\n\nfragment Variation on Variation {\n  id\n  significantImproveOrigin\n  assetType\n  generationTool\n  source\n  suggestionMode\n  recomposeMode\n  status\n  copyText\n  copyTextMarkup\n  score\n  isEnterpriseScoreUsed\n  lastUpdateTime\n  createdAt\n  ageScoreHistogram\n  genderScoreHistogram\n  scoringMethod {\n    id\n    type\n    name\n    __typename\n  }\n  secondaryScoringMethod {\n    id\n    type\n    name\n    __typename\n  }\n  contentSafety {\n    ...ContentValidation\n    __typename\n  }\n  engagementScoreSupportSize\n  landingPageAsset {\n    id\n    significantImproveScoreThreshold\n    __typename\n  }\n  generationGuidance {\n    keywords\n    campaignKeywords\n    features\n    benefits\n    pains\n    avatar\n    tov\n    __typename\n  }\n  isScoreLocked\n  isRecompose\n  __typename\n}\n\nfragment ContentValidation on ContentValidation {\n  label\n  reason\n  reasonDetails\n  __typename\n}\n\nfragment CustomerPersona on CustomerPersona {\n  id\n  name\n  minAge\n  maxAge\n  gender\n  painPoints\n  avatarType\n  __typename\n}",
      variables: {
        annotations: [],
        brief: {
          freeText: input,
        },
        customerPersona: {},
        debugAcPrompt: null,
        generationTool: "basic_eli5",
        language: "en-us",
        numberOfVariations: 3,
        projectId: 3429168,
        scoringMethod: {
          id: 697,
          type: "ContentTaxonomy",
        },
        suggestionMode: "default",
        tov: null,
      },
    };
    const response = await axios.post(process.env.REPHRASER_URL, payload, {
      headers: {
        "x-access-token": process.env.REPHRASER_TOKEN,
      },
    });
    const variations =
      response.data.data.suggestVariationsForDocumentEditor.variations;
    let description = "";
    variations.map((el, i) => {
      description += `Result ${i + 1}: \n` + el.copyText + "\n\n";
    });

    const embeddedMessage = new EmbedBuilder()
      .setTitle("Simplifier Results")
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

module.exports = { rephrase, simplify };
