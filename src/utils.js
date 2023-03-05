const axios = require("axios");
const fs = require("fs");

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

module.exports = { arrayToDescription, urlToBuffer };
