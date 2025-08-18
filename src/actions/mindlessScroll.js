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
        await page.waitForSelector(".x1qjc9v5.x9f619.x78zum5.xg7h5cd.x1xfsgkm.xqmdsaz.x1bhewko.xgv127d.xh8yej3.xl56j7k");
        
        // Start scrolling
        const reels = await page.$$('div.x5yr21d.x1uhb9sk.xh8yej3')
        const limit = getRandomInt(2,reels.length-1)
        for(let i =1;i<limit ;i++){
            await reels[i].scrollIntoView({behavior: 'smooth', block: 'center' })
            await delay(getRandomInt(7,50)*232)
        }
    } catch (error) {
        console.error("Error in mindlessScroll:", error.message);
    }
}

