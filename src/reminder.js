const { EmbedBuilder } = require("discord.js");
const {
  sendReminder,
  isTerminated,
  removeFromTerminated,
  addToReminders,
  addToTerminated,
  modifyReminders,
} = require("./utils");

const reminder = async (user, interaction, client, remind) => {
  try {
    let title, description, mode, time, extra, author;
    if (interaction !== null) {
      title = interaction.options
        ? interaction.options.getString("title")
        : "Untitled Reminder";
      description = interaction.options
        ? interaction.options.getString("description")
        : "No description provided";
      mode = interaction.options
        ? interaction.options.getString("mode")
        : "Everyday";
      time = interaction.options
        ? interaction.options.getString("time")
        : "00:00";
      extra = interaction.options ? interaction.options.getString("extra") : "";
    } else {
      title = remind.title;
      description = remind.description;
      mode = remind.mode;
      time = remind.time;
      extra = remind.extra;
      author = remind.author;
    }

    if (interaction !== null) {
      await interaction.deferReply({ ephemeral: false });
    }

    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));

    if (mode === "Everyday") {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
      }
      const timeRemaining =
        date.getTime() - new Date(Date.now() + 8 * 60 * 60 * 1000).getTime();
      setTimeout(async () => {
        if (await isTerminated(title)) {
          return;
        }
        if (timeRemaining >= 0) {
          sendReminder(user, interaction, client, title, description, author);
        }
        const inter = setInterval(async () => {
          if (await isTerminated(title)) {
            clearInterval(inter);
          }
          sendReminder(user, interaction, client, title, description, author);
        }, 24 * 60 * 60 * 1000);
      }, timeRemaining);
    } else if (mode === "Once") {
      const [day, month, year] = extra
        .split("-")
        .map((str) => parseInt(str, 10));
      const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const timeRemaining =
        date.getTime() - new Date(Date.now() + 8 * 60 * 60 * 1000).getTime();
      setTimeout(async () => {
        if (await isTerminated(title)) {
          return;
        }
        if (timeRemaining >= 0) {
          sendReminder(user, interaction, client, title, description, author);
        }
        addToTerminated(title);
      }, timeRemaining);
    } else {
      // Recurring
      extra = extra.replace(/\s/g, "");
      let days = extra.split(",");
      const daysArr = ["su", "m", "t", "w", "th", "f", "sa"];
      for (let i = 0; i < days.length; i++) {
        let dayIndex = days[i];
        if (!Number.isInteger(dayIndex)) {
          dayIndex = daysArr.indexOf(days[i].toLowerCase());
        }
        if (dayIndex !== -1) {
          console.log(dayIndex);
          days[i] = dayIndex;
        }
      }
      console.log(days);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
      }
      const timeRemaining =
        date.getTime() - new Date(Date.now() + 8 * 60 * 60 * 1000).getTime();
      setTimeout(async () => {
        if (await isTerminated(title)) {
          return;
        }
        if (timeRemaining >= 0 && days.includes(date.getDay())) {
          sendReminder(user, interaction, client, title, description, author);
        }

        const inter = setInterval(async () => {
          if (await isTerminated(title)) {
            clearInterval(inter);
          }
          if (days.includes(date.getDay())) {
            sendReminder(user, interaction, client, title, description, author);
          }
        }, 24 * 60 * 60 * 1000);
      }, timeRemaining);
    }

    if (user !== null) {
      const embeddedMessage = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({
          name: user.username,
          iconURL: user.defaultAvatarURL,
        })
        .setColor("DarkOrange")
        .setDescription("Reminder set!");

      if (await isTerminated(title)) {
        await removeFromTerminated(title);
        await modifyReminders(
          title,
          interaction.user.id,
          description,
          mode,
          time,
          extra
        );
      } else {
        if (
          (await addToReminders(
            title,
            interaction.user.id,
            description,
            mode,
            time,
            extra
          )) !== -1
        ) {
          embeddedMessage.setTitle("Error Adding Reminder");
          embeddedMessage.setDescription(
            "Reminder with the same title already exists!"
          );
          embeddedMessage.setColor("Red");
        }
      }

      interaction.editReply({
        embeds: [embeddedMessage],
      });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error.message);
    }
  }
};

const terminate = async (user, interaction) => {
  try {
    const title = interaction.options
      ? interaction.options.getString("title")
      : "Untitled Reminder";

    await interaction.deferReply({ ephemeral: false });

    const embeddedMessage = new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription("Reminder terminated!");

    if ((await addToTerminated(title)) !== -1) {
      embeddedMessage.setTitle("Error Terminating Reminder");
      embeddedMessage.setDescription(
        "Reminder with the same title already terminated!"
      );
      embeddedMessage.setColor("Red");
    }

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

module.exports = { reminder, terminate };
