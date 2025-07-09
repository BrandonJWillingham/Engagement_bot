// frameInterpreter.js
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

export async function interpretFrames(framesDir) {
    try {
        // Gather descriptions of all frames
        const frameDescriptions = [];
        const files = fs.readdirSync(framesDir);

        for (const file of files) {
            const framePath = path.join(framesDir, file);
            const frameData = fs.readFileSync(framePath, { encoding: "base64" });
            frameDescriptions.push(`Frame ${file}: ${frameData}`);
        }

        // Combine all frame descriptions into one message
        const frameSummary = frameDescriptions.join("\n");

        // Generate a single comment based on the entire frame set
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a social media expert that generates creative, contextually accurate Instagram comments based on a series of video frames."
                },
                {
                    role: "user",
                    content: `Generate a single, engaging Instagram comment based on these video frames:\n\n${frameSummary}`
                }
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        const comment = response.data.choices[0].message.content.trim();
        console.log("✅ Generated Comment:", comment);
        return comment;
    } catch (error) {
        console.error("❌ Error interpreting frames:", error);
        return null;
    }
}
