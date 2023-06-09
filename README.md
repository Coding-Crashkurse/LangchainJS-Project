# YouTube Transcript Summarizer

This project is a server-side application that provides automatic summarization of YouTube video transcripts. Leveraging the power of OpenAI's GPT-4, the server analyzes transcripts fetched from YouTube and provides concise summaries of the video content. This can be extremely useful for obtaining quick insights from long videos without the need to watch the entire content.

## Project Overview

The application is developed with Node.js and Express.js for handling server-side operations. It fetches video transcripts using the `youtube-transcript` package, stores them in a local text file, and if available, it reads from this file for subsequent requests to minimize API calls.

The heart of the project lies in its language understanding and summarization process. It uses OpenAI GPT-4 model for this purpose. A prompt template is prepared, which instructs the AI to summarize the transcript regardless of its original language.

The server listens for GET requests at the route `/transcripts/:videoId`, where `:videoId` is the ID of the YouTube video you want to summarize. On receipt of a request, the server attempts to read a locally stored transcript. If the transcript does not exist, the server fetches the transcript using the YouTube Transcript API and stores it locally for future reference. The transcript is then processed by the OpenAI model to produce a summary.

If the YouTube video has disabled transcripts, an error message is returned to the client, notifying them that a transcript could not be fetched. If any other error occurs during the process, the server sends a generic error message.

## Running the Application

To run the application, you need to install the necessary Node.js dependencies, including `express`, `youtube-transcript`, `cors`, `fs`, `openai`, and `langchain`. Once the dependencies are installed, the application can be started with the `node app.js` command (assuming the main file is named `app.js`). The server will start and listen on port 5566.

## Important Note

For the application to function properly, you need to provide a valid OpenAI API key. The key is necessary to interface with the OpenAI GPT-4 model and should be kept confidential to prevent misuse.
