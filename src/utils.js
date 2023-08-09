const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const fsp = require("fs").promises;
require("dotenv").config();

const arrayToDescription = (sentenceArr) => {
  let description =
    sentenceArr.length > 0
      ? "Sentences that might be AI Generated\n\n"
      : "No Sentences Detected. <3\n\n";

  sentenceArr.forEach((el) => {
    description += el.sentence + "\n";
    description += `AI Probability: ${(el.score * 100).toFixed(2)}%\n\n`;
  });

  return description;
};

const urlToBuffer = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "binary");
  const filename = "./image.png";
  fs.writeFile(filename, buffer, (err) => {
    if (err) {
      console.log(err);
    }
  });

  return filename;
};

const isTerminated = async (title) => {
  try {
    const terminatedReminders = JSON.parse(
      await fsp.readFile("src/json/terminatedReminders.json")
    );

    for (let i = 0; i < terminatedReminders.length; i++) {
      if (terminatedReminders[i] === title) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(
      "Error reading or parsing the terminatedReminders.json file:",
      error
    );
    return false;
  }
};

const addToReminders = async (
  title,
  author,
  description,
  mode,
  time,
  extra
) => {
  try {
    let reminders = [];
    if (
      await fsp
        .access("src/json/reminders.json")
        .then(() => true)
        .catch(() => false)
    ) {
      reminders = JSON.parse(await fsp.readFile("src/json/reminders.json"));
    }
    const existingReminderIndex = reminders.findIndex(
      (reminder) => reminder.title === title
    );

    if (existingReminderIndex === -1) {
      reminders.push({
        title: title,
        author: author,
        description: description,
        mode: mode,
        time: time,
        extra: extra,
      });
    }

    await fsp.writeFile(
      "src/json/reminders.json",
      JSON.stringify(reminders, null, 2)
    );
    console.log("Added the reminder to reminders.json successfully.");
    return existingReminderIndex;
  } catch (error) {
    console.error("Error adding the reminder to reminders.json:", error);
  }
};

const addToTerminated = async (title) => {
  try {
    let terminatedReminders = [];
    if (
      await fsp
        .access("src/json/terminatedReminders.json")
        .then(() => true)
        .catch(() => false)
    ) {
      terminatedReminders = JSON.parse(
        await fsp.readFile("src/json/terminatedReminders.json")
      );
    }
    const existingReminderIndex = terminatedReminders.findIndex(
      (terminatedReminders) => terminatedReminders.title === title
    );

    if (existingReminderIndex === -1) {
      terminatedReminders.push(title);
    }

    await fsp.writeFile(
      "src/json/terminatedReminders.json",
      JSON.stringify(terminatedReminders, null, 2)
    );
    console.log("Added the reminder to terminatedReminders.json successfully.");
    return existingReminderIndex;
  } catch (error) {
    console.error(
      "Error adding the reminder to terminatedReminders.json:",
      error
    );
  }
};

const removeFromTerminated = async (title) => {
  try {
    const terminatedReminders = JSON.parse(
      await fsp.readFile("src/json/terminatedReminders.json")
    );

    const updatedTerminatedReminders = terminatedReminders.filter(
      (item) => item !== title
    );

    await fsp.writeFile(
      "src/json/terminatedReminders.json",
      JSON.stringify(updatedTerminatedReminders, null, 2)
    );
    console.log(
      "Removed the title from terminatedReminders.json successfully."
    );
  } catch (error) {
    console.error(
      "Error removing the title from terminatedReminders.json:",
      error
    );
  }
};

const modifyReminders = async (
  title,
  author,
  description,
  mode,
  time,
  extra
) => {
  try {
    let reminders = [];
    if (
      await fsp
        .access("src/json/reminders.json")
        .then(() => true)
        .catch(() => false)
    ) {
      reminders = JSON.parse(await fsp.readFile("src/json/reminders.json"));
    }
    const existingReminderIndex = reminders.findIndex(
      (reminder) => reminder.title === title
    );

    reminders[existingReminderIndex] = {
      title: title,
      author: author,
      description: description,
      mode: mode,
      time: time,
      extra: extra,
    };

    await fsp.writeFile(
      "src/json/reminders.json",
      JSON.stringify(reminders, null, 2)
    );
    console.log("Modified reminder successfully.");
  } catch (error) {
    console.error("Error modifying the reminder:", error);
  }
};

async function sendReminder(
  user,
  interaction,
  client,
  title,
  description,
  author
) {
  const channel = client.channels.cache.get(process.env.REMINDER_CHANNEL_ID);
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setAuthor({
      name: user.username,
      iconURL: user.defaultAvatarURL,
    })
    .setColor("DarkOrange")
    .setDescription(description);
  channel
    .send({
      content: `<@${interaction ? interaction.user.id : author}>`,
      embeds: [embed],
    })
    .then(() => console.log("Reminder sent successfully."))
    .catch((error) => console.error("Error sending reminder:", error));
}

module.exports = {
  arrayToDescription,
  urlToBuffer,
  isTerminated,
  addToReminders,
  removeFromTerminated,
  addToTerminated,
  modifyReminders,
  sendReminder,
};
