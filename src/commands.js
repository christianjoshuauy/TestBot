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
      "Dall-E AI Image Variation Generator - Accepts .png files: #image-ai"
    )
    .addAttachmentOption((option) => {
      return option.setName("image").setDescription("image").setRequired(true);
    }),
  new SlashCommandBuilder()
    .setName("changpt-ask")
    .setDescription("ChatGPT-3: #chatgpt")
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
];

module.exports = commands;
