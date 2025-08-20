import { delay } from "../helpers/delay.js";
import { getRandomInt } from "../helpers/random.js";

export async function mindlessScroll(page) {
    try {
        // Click the Reels button
        const reelsButton = await page.$("svg[aria-label='Reels']");
        if (!reelsButton) throw new Error("Reels button not found");
        
        await reelsButton.click();
        await delay(getRandomInt(2, 10) * 148);

        // Wait for the scrolling container to load
        await page.waitForSelector(".xvbhtw8.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k");
        
        // Start scrolling
        const limit = getRandomInt(2,30)
        for(let i =1;i<limit ;i++){
            await delay(getRandomInt(100,1000)*10)
            await page.keyboard.press('ArrowDown')
        }
    } catch (error) {
        console.error("Error in mindlessScroll:", error.message);
    }
}

