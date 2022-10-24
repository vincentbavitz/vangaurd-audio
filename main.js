const textToSpeech = require("@google-cloud/text-to-speech");

const fs = require("fs/promises");
const lodash = require("lodash");

const client = new textToSpeech.TextToSpeechClient({
  // projectId: <<projectID>>,
});

async function quickStart() {
  await client.initialize();

  // The text to synthesize
  const vanguardBuffer = await fs.readFile("./vangaurd.txt");
  const vanguard = vanguardBuffer.toString();
  console.log("main ➡️ vanguard:", vanguard);

  // Ensure we don't go over 5000 character limit
  const chunks = lodash.chunk(vanguard, 5000).map((c) => c.join(""));

  chunks.forEach(async (chunk, key) => {
    const request = {
      input: { text: chunk },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);

    const filename = `vanguard-audio-${key}.mp3`;
    await fs.writeFile(filename, response.audioContent, "binary");

    console.log(`Audio content written to file: ${filename}`);
  });
}

quickStart();
