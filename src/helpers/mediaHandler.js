import video from "@google-cloud/video-intelligence"
import OpenAI from "openai";
import { addComment } from "./commentTracker.js";
export const CHATGPT_API_KEY = "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"


const clientGBT = new OpenAI({apiKey:`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`});
const client = new video.VideoIntelligenceServiceClient();

export async function recordFullVideo(page, elementHandle) {
  return await elementHandle.evaluate(async (el) => {
    const video = el.querySelector('video');
    if (!video) throw new Error("No <video> tag found");

    // Wait for metadata to load (duration)
    if (video.readyState < 1) {
      await new Promise(resolve => video.onloadedmetadata = resolve);
    }

    const duration = video.duration;
    if (!duration || isNaN(duration)) throw new Error("Could not determine video duration");

    const stream = video.captureStream();
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    return await new Promise((resolve, reject) => {
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onerror = reject;

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result); // 👈 BASE64 here
        reader.onerror = reject;

        reader.readAsDataURL(blob); // 👈 Converts blob to base64 string
      };

      recorder.start();
      video.play();

      setTimeout(() => {
        recorder.stop();
      }, (duration + 0.5) * 1000); // add slight buffer
    });
  });
}

export async function base64WithBlob(page, blobUrl) {
    return await page.evaluate(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
        });
    }, blobUrl);  // <-- pass blobUrl here
} 

export async function processMedia(page,base64) {
    // const base64String = base64WithBlob(page,srcUrl)
    const combinedComment = await askAi(base64)
    addComment(combinedComment)
    return combinedComment
}

async function askAi(base64Video){
    try {
        // Start the video analysis
        const [operation] = await client.annotateVideo({
            inputContent: base64Video,
            features: [
                "LABEL_DETECTION",
                "SHOT_CHANGE_DETECTION",
                "OBJECT_TRACKING",
                "LOGO_RECOGNITION",
                "TEXT_DETECTION"
            ],
        });

        console.log("Processing video...");
        const [response] = await operation.promise();

        // Organize data by scenes
        const scenes = [];
        response.annotationResults.forEach(result => {
            // Create a scene object
            const scene = {
                labels: new Set(),
                logos: new Set(),
                objects: new Set(),
                texts: new Set(),
            };

            // Extract all available information
            result.segmentLabelAnnotations.forEach(label => scene.labels.add(label.entity.description));
            result.logoRecognitionAnnotations.forEach(logo => scene.logos.add(logo.entity.description));
            result.objectAnnotations.forEach(object => scene.objects.add(object.entity.description));
            result.textAnnotations.forEach(text => scene.texts.add(text.text));

            // Convert Sets to Arrays for readability
            scenes.push({
                labels: Array.from(scene.labels),
                logos: Array.from(scene.logos),
                objects: Array.from(scene.objects),
                texts: Array.from(scene.texts),
            });
        });

        // Format the scene description
        const formattedDescription = scenes.map((scene, index) => `
            Scene ${index + 1}:
            - Labels: ${scene.labels.join(", ")}
            - Objects: ${scene.objects.join(", ")}
            - Logos: ${scene.logos.join(", ")}
            - Texts: ${scene.texts.join(", ")}
        `).join("\n");

         // Generate ChatGPT prompt
        const chatPrompt = `
            I have a video with the following scenes:

            ${formattedDescription}

            Please generate a witty and encouraging Instagram comment based on this video.
        `;

        // Send to ChatGPT
        const gptResponse = await clientGBT.createChatCompletion({
            model: "gpt-4.1-nano",
            messages: [{ role: "user", content: chatPrompt }],
            max_tokens: 200,
        });

        return gptResponse.data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Error analyzing video:", error);
       
    }
}