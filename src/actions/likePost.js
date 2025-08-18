import { delay } from "../helpers/delay";
import { scrolling } from "../helpers/elementUtils";
import { getRandomHash } from "../helpers/inputManagement";
import { getRandomInt } from "../helpers/random";


export async function likeByHash(page) {
    try {
        const tag = getRandomHash()
        await search(page,tag);
        await delay(getRandomInt(2, 5) * 1000);

        await page.waitForSelector("._aagu")
        const container = page.$("x78zum5.xdt5ytf.x11lt19s.x1n2onr6.xph46j.x7x3xai.xsybdxg.x194l6zq")
        await delay(getRandomInt(2, 5) * 1000);
        await scrolling(page,container,20);

        const posts = page.$$("._aagu")
        const selectedPost = posts[getRandomInt(0,posts.length -1)]
        await delay(2000);

        await selectedPost.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); 
        await selectedPost.click()
        await delay(getRandomInt(2, 5) * 1000);

        const dialog = await page.$("div[role='dialog']")
        const likeButton = await dialog.$('svg[aria-label="Like"')
        await likeButton.click()
        await delay(getRandomInt(2, 5) * 1000);
        
        await page.keyboard.press("Escape");

    } catch (error) {
        console.error("Error during likeAndCommentPosts:", error.message);
    }
}

async function like(){
    await delay(getRandomInt(3,10)*1000)
    await page.$("svg[aria-label='Like']").click()
}
async function nextPost(){
    await delay(2000)
    await page.$("svg[aria-label='Next']").click()
}
