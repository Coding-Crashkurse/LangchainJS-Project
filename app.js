const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const model = new OpenAI({
  openAIApiKey: "sk-", // add your own api key
  temperature: 0.9,
});
const template =
  "Identify the language of the transcript and summarise it in max. 100 words in english. Ignore the original language of the text, it does not matter. Just focus on the content\n\n {transcript}";
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["transcript"],
});
const chain = new LLMChain({ llm: model, prompt: prompt });

app.get("/transcripts/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const filename = `${videoId}.txt`;

  try {
    const data = await fs.readFile(filename, "utf-8");
    const summarizedData = await chain.call({ transcript: data });
    res.json({ text: summarizedData });
    return;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Failed to read the file:", err);
      res
        .status(500)
        .json({ message: "An error occurred while reading the file." });
      return;
    }
  }

  try {
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    const fullTranscript = transcriptData.map((item) => item.text).join(" ");
    await fs.writeFile(filename, fullTranscript);

    const summarizedData = await chain.call({ transcript: fullTranscript });
    console.log(summarizedData);
    res.json({ text: summarizedData });
  } catch (err) {
    console.error("Failed to fetch the transcript:", err);
    if (err.message.includes("Transcript is disabled on this video")) {
      res.json({ text: "Transscript is disabled for this video!" });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while fetching the transcript." });
    }
  }
});

app.listen(5566, () => console.log("Server is running on port 5566"));
