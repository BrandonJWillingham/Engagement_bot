import { getRandomInt } from "./random.js";
import { delay } from "./delay.js";

export async function scrolling(page, selector, limit = 20) {
    try {
        console.log("scroll function called to this selector:", selector);
        for (let i = 0; i < limit; i++) {
            await page.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (el) {
                    console.log("mindless scroll el:", el);
                    el.scrollTop += Math.floor(Math.random() * 300) + 100;
                }
            }, selector);
            await delay(getRandomInt(5, 15) * 358);
        }
    } catch (error) {
        console.error("Error in scroll function:", error.message);
    }
}
