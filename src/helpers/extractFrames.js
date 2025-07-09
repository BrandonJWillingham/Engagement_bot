// extractFrames.js
const ffmpeg = require("fluent-ffmpeg");

function extractFrames(videoPath, framesDir, fps = 1) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .output(`${framesDir}/frame_%04d.jpg`)
            .videoFilter(`fps=${fps}`)
            .on("end", () => {
                console.log("✅ Frames extracted successfully");
                resolve();
            })
            .on("error", (err) => {
                console.error("❌ Frame extraction failed:", err);
                reject(err);
            })
            .run();
    });
}

module.exports = { extractFrames };