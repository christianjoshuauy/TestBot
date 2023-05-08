const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

let session = "4de4ukm2rajg8pqvj1a2k9099c";

const getString = (str, start, end) => {
  str = " " + str;
  let ini = str.indexOf(start);
  if (ini === -1) return "";
  ini += start.length;
  const len = str.indexOf(end, ini) - ini;
  return str
    .substring(ini, ini + len)
    .replace(/(<([^>]+)>)/gi, "")
    .trim();
};

const unlock = async (user, interaction) => {
  try {
    const input = interaction.options.getString("text");
    await interaction.deferReply({
      ephemeral: false,
    });
    const payload = {
      userInput: input,
    };
    const response = await axios.post(process.env.UNLOCKER_URL, payload, {
      headers: {
        authority: "suschegg.com",
        cookie: `PHPSESSID=${session}; _ga_JG6V16432H=GS1.1.1683438184.1.1.1683439432.0.0.0; _ga=GA1.1.299728184.1683438185; crisp-client%2Fsession%2F4f0f6043-4354-4449-9d88-1f8a0b469af0=session_29451f30-0b4b-4e60-a188-22599936c2bb`,
        origin: "https://suschegg.com",
        referer: "https://suschegg.com/dashboard",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
        "accept-encoding": "gzip, deflate",
      },
    });
    const answer = response.data;
    session = getString(response.headers["set-cookie"][0], "PHPSESSID=", ";");

    const embeddedMessage = new EmbedBuilder()
      .setTitle("Here's your rephrased text")
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(answer);

    await interaction.editReply({
      embeds: [embeddedMessage],
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      session = getString(
        error.response.headers["set-cookie"][0],
        "PHPSESSID=",
        ";"
      );
    } else {
      console.log(error.message);
    }
    const embeddedMessage = new EmbedBuilder()
      .setTitle("Error Occured :<")
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(error.message);

    await interaction.editReply({
      embeds: [embeddedMessage],
    });
  }
};

const rephrase = async (user, interaction) => {
  try {
    const input = interaction.options.getString("text");
    const mode = interaction.options
      ? interaction.options.getString("mode")
      : "Standard";
    const strength = interaction.options
      ? interaction.options.getString("strength")
      : "100%";
    await interaction.deferReply({
      ephemeral: false,
    });
    const payload = {
      userInput: "quillbot",
      text: input,
      mode: mode,
      strength: strength,
    };
    const response = await axios.post(process.env.UNLOCKER_URL, payload, {
      headers: {
        authority: "suschegg.com",
        cookie: `PHPSESSID=${session}; _ga_JG6V16432H=GS1.1.1683438184.1.1.1683439432.0.0.0; _ga=GA1.1.299728184.1683438185; crisp-client%2Fsession%2F4f0f6043-4354-4449-9d88-1f8a0b469af0=session_29451f30-0b4b-4e60-a188-22599936c2bb`,
        origin: "https://suschegg.com",
        referer: "https://suschegg.com/dashboard",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
        "accept-encoding": "gzip, deflate",
      },
    });
    const answer = response.data;
    session = getString(response.headers["set-cookie"][0], "PHPSESSID=", ";");

    const embeddedMessage = new EmbedBuilder()
      .setTitle("Here's your answer!")
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(answer);

    await interaction.editReply({
      embeds: [embeddedMessage],
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      session = getString(
        error.response.headers["set-cookie"][0],
        "PHPSESSID=",
        ";"
      );
    } else {
      console.log(error.message);
    }
    const embeddedMessage = new EmbedBuilder()
      .setTitle("Error Occured :<")
      .setAuthor({
        name: user.username,
        iconURL: user.defaultAvatarURL,
      })
      .setColor("DarkOrange")
      .setDescription(error.message);

    await interaction.editReply({
      embeds: [embeddedMessage],
    });
  }
};

const refresh = async () => {
  try {
    const response = await axios.post(
      process.env.REFRESH_UNLOCKER_URL,
      payload,
      {
        headers: {
          authority: "suschegg.com",
          cookie: `PHPSESSID=${session}; _ga_JG6V16432H=GS1.1.1683438184.1.1.1683439432.0.0.0; _ga=GA1.1.299728184.1683438185; crisp-client%2Fsession%2F4f0f6043-4354-4449-9d88-1f8a0b469af0=session_29451f30-0b4b-4e60-a188-22599936c2bb`,
          // origin: "https://suschegg.com",
          referer: "https://suschegg.com/login",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
          "accept-encoding": "gzip, deflate",
        },
      }
    );
    session = getString(response.headers["set-cookie"][0], "PHPSESSID=", ";");
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      session = getString(
        error.response.headers["set-cookie"][0],
        "PHPSESSID=",
        ";"
      );
    } else {
      console.log(error.message);
    }
  }
};

setTimeout(refresh, 1000 * 60 * 5);

module.exports = { unlock, rephrase };
