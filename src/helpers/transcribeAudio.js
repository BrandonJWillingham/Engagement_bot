// transcribeAudio.js
const ffmpeg = require("fluent-ffmpeg");
const whisper = require("whisper-node");

async function extractAndTranscribeAudio(videoPath, audioDir) {
    const audioFile = `${audioDir}/output.wav`;
    
    // Extract the audio
    await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .noVideo()
            .audioCodec("pcm_s16le")
            .output(audioFile)
            .on("end", () => {
                console.log("✅ Audio extracted successfully");
                resolve();
            })
            .on("error", (err) => {
                console.error("❌ Audio extraction failed:", err);
                reject(err);
            })
            .run();
    });

    // Transcribe the audio
    const transcription = await whisper.transcribe(audioFile);
    console.log("✅ Transcription complete:", transcription);
    return transcription;
}

module.exports = { extractAndTranscribeAudio };