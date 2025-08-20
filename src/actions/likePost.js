import { delay } from "../helpers/delay.js";
import { scrolling } from "../helpers/elementUtils.js";
import { getRandomHash } from "../helpers/inputManagement.js";
import { getRandomInt } from "../helpers/random.js";
import { search } from "./search.js";


export async function likeByHash(page) {
    try {
        const tag = getRandomHash()
        console.log(tag)
        await search(page,tag);
        await delay(getRandomInt(2, 5) * 1000);
        await page.keyboard.press('Escape')

        await page.waitForSelector("._aagu")
+       await delay(getRandomInt(2, 5) * 1000);
        await scrolling(page,"._9dls._ar44.js-focus-visible._aa4c.__fb-light-mode",5);

        const posts = await page.$$("._aagu")
        const selectedPost = posts[getRandomInt(0,posts.length -1)]
        await selectedPost.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); 
        await selectedPost.click()
        await delay(getRandomInt(2, 5) * 1000);

        await page.click('div[role="dialog"] article img', { clickCount: 2, delay: 40 });
        
        await page.waitForSelector('div[role="dialog"] svg[aria-label="Unlike"]', { timeout: 2000 })
  .     catch(() => console.warn("⚠️ Like may not have registered"));
        await page.keyboard.press("Escape");

    } catch (error) {
        console.error("Error during likeAndCommentPosts:", error.message);
    }
}

