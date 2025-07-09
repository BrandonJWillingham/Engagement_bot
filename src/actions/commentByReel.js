import { delay } from "../helpers/delay.js";
import { scrolling } from "../helpers/elementUtils.js";
import { processMedia, recordFullVideo } from "../helpers/mediaHandler.js";
import { getRandomInt } from "../helpers/random.js";

export async function commentByReel(page) {
    try {
        // Click the Reels button
        await page.waitForSelector('svg[aria-label="Reels"]');
        const reelsButton = await page.$('svg[aria-label="Reels"]');
        await reelsButton.click();
        await delay(getRandomInt(2, 10) * 148);
    
        // Wait for the reels to load
        await page.waitForSelector(".x1qjc9v5.x9f619.x78zum5.xg7h5cd.x1xfsgkm.xqmdsaz.x1bhewko.xgv127d.xh8yej3.xl56j7k");
        await page.reload()
        await page.waitForSelector(".x1qjc9v5.x9f619.x78zum5.xg7h5cd.x1xfsgkm.xqmdsaz.x1bhewko.xgv127d.xh8yej3.xl56j7k");
        await delay(getRandomInt(2, 10) * 148);
        let posts = await page.$$(".x1qjc9v5.x9f619.x78zum5.xg7h5cd.x1xfsgkm.xqmdsaz.x1bhewko.xgv127d.xh8yej3.xl56j7k");
        
        // Select a random reel
        console.log("posts: ", posts)
        const selectedInt = getRandomInt(0, posts.length - 1);
        const selectedPostHandle = posts[selectedInt]
        const selectedPost = await selectedPostHandle.asElement() ;
        console.log(`Selected Reel Index: ${selectedInt}`);
        console.log(`Selected Reel: ${selectedPost}`);
        // Scroll to the selected post
        for (let i = 1; i < selectedInt; i++) {
            console.log(`Scrolling to post ${i + 1}`);
            await posts[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(getRandomInt(20, 50) * 123);
        }

        // Click the comment button
        const commentButton = await selectedPost.$("svg[aria-label='Comment']");
        console.log("Comment button: ", commentButton);
        await commentButton.click();
        await delay(getRandomInt(20, 50) * 123);

        // Extract the media URL
        // const srcUrl = await page.evaluate((parent) => {
        //     const media = parent.querySelector('video');
        //     return media ? media.src : null;
        // }, selectedPost);
        // console.log("Extracted Media URL:", srcUrl);


        const base64 = await recordFullVideo(page,selectedPostHandle)
        // Generate the comment
        const comment = await processMedia(base64);

        // Type and post the comment
        const commentInput = await page.$('input[placeholder="Add a comment…"]');
        await commentInput.type(comment, { delay: 100 });
        await delay(getRandomInt(1, 10) * 98);
        await commentInput.press("Enter");

        // Close the modal
        await delay(getRandomInt(20, 50) * 123);
        await page.keyboard.press('Escape');
    } catch (error) {
        console.error("Error in commentByReel function:", error.message);
    }
}
