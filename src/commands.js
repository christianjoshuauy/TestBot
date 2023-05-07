const { SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("changpt-image")
    .setDescription("Dall-E AI Image Generator: #image-ai")
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("prompt")
        .setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("changpt-image-variation")
    .setDescription(
      "Dall-E AI Image Variation Generator - Accepts SQUARE .png files : #image-ai"
    )
    .addAttachmentOption((option) => {
      return option.setName("image").setDescription("image").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("changpt-ask")
    .setDescription("ChatGPT-3.5: #chatgpt")
    .addStringOption((option) => {
      return option
        .setName("model")
        .setDescription("model")
        .setRequired(true)
        .addChoices({ name: "ChatGPT-3.5", value: "gpt-3.5-turbo" })
        .addChoices({ name: "ChatGPT-4", value: "gpt-4" })
        .addChoices({
          name: "ChatGPT-4 w/ longer context length",
          value: "gpt-4-32k",
        });
    })
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("prompt")
        .setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("detect")
    .setDescription("Detect AI Content: #ai-detection")
    .addStringOption((option) => {
      return option.setName("text").setDescription("text").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("check-plagiarism")
    .setDescription("Plagiarism Checker: #plagiarism-checker")
    .addStringOption((option) => {
      return option.setName("text").setDescription("text").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("rephrase")
    .setDescription("Content Rephraser: #writing-tools")
    .addStringOption((option) => {
      return option
        .setName("strength")
        .setDescription("strength")
        .setRequired(true)
        .addChoices({ name: "33%", value: "33%" })
        .addChoices({ name: "66%", value: "66%" })
        .addChoices({ name: "100%", value: "100%" });
    })
    .addStringOption((option) => {
      return option
        .setName("mode")
        .setDescription("mode")
        .setRequired(true)
        .addChoices({ name: "Standard", value: "Standard" })
        .addChoices({ name: "Fluency", value: "Fluency" })
        .addChoices({ name: "Formal", value: "Formal" })
        .addChoices({ name: "Simple", value: "Simple" })
        .addChoices({ name: "Creative", value: "Creative" })
        .addChoices({ name: "Expand", value: "Expand" })
        .addChoices({ name: "Shorten", value: "Shorten" });
    })
    .addStringOption((option) => {
      return option.setName("text").setDescription("text").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("simplify")
    .setDescription(
      "Content Simplifier, explain to a three year old: #writing-tools"
    )
    .addStringOption((option) => {
      return option.setName("text").setDescription("text").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Homework Answers Unlocker: #unlocker")
    .addStringOption((option) => {
      return option.setName("text").setDescription("text").setRequired(true);
    }),
];

module.exports = commands;
