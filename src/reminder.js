const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();

const reminder = async (user, interaction, client) => {
  try {
    const title = interaction.options
      ? interaction.options.getString("title")
      : "Untitled Reminder";
    const description = interaction.options
      ? interaction.options.getString("description")
      : "No description provided";
    const mode = interaction.options
      ? interaction.options.getString("mode")
      : "Everyday";
    const time = interaction.options
      ? interaction.options.getString("time")
      : "00:00";
    const extra = interaction.options
      ? interaction.options.getString("extra")
      : "";

    function sendReminder() {
      const channel = client.channels.cache.get(
        process.env.REMINDER_CHANNEL_ID
      );
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({
          name: user.username,
          iconURL: user.defaultAvatarURL,
        })
        .setColor("DarkOrange")
        .setDescription(description);
      channel
        .send({ content: `<@${interaction.user.id}>`, embeds: [embed] })
        .then(() => console.log("Reminder sent successfully."))
        .catch((error) => console.error("Error sending reminder:", error));
    }

    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));

    if (mode === "Everyday") {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
      }
      const timeRemaining = currentDate.getTime() - Date.now();
      setTimeout(() => {
        sendReminder();
        setInterval(() => {
          sendReminder();
        }, 24 * 60 * 60 * 1000);
      }, timeRemaining);
    } else if (mode === "Once") {
      const [day, month, year] = extra
        .split("-")
        .map((str) => parseInt(str, 10));
      const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const timeRemaining = date.getTime() - Date.now();
      setTimeout(() => {
        sendReminder();
      }, timeRemaining);
    } else {
      // Recurring
      extra = extra.replace(/\s/g, "");
      const days = extra.split(",");
      const daysArr = ["m", "t", "w", "th", "f", "sa", "su"];
      for (let i = 0; i < days.length; i++) {
        if (days[i].toLowerCase() === daysArr[i]) {
          days[i] = i;
        }
      }
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
      }
      const timeRemaining = currentDate.getTime() - Date.now();
      setTimeout(() => {
        if (days.includes(date.getDay())) {
          sendReminder();
        }
        setInterval(() => {
          sendReminder();
        }, 24 * 60 * 60 * 1000);
      }, timeRemaining);
    }

    const embeddedMessage = new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription("Reminder set!");

    interaction.reply({
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

module.exports = reminder;
