import { delay } from "../helpers/delay.js";
import { markLiked } from "../helpers/inputManagement.js";
import { getRandomInt } from "../helpers/random.js";

export async function likeUserPost(page, username){

    page.goto(`instagram.com/${username}`)
    await delay(getRandomInt(2, 5) * 1000);


    const postElements = await page.$$('._aagu');
    if (postElements.length < 2) {
        console.log('Not enough posts to engage with.');
        return;
    }

    const targetPost = postElements[getRandomInt(0,postElements.length)];
    await targetPost.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await delay(getRandomInt(2, 5) * 1000);

    await targetPost.click()
    await delay(getRandomInt(2, 5) * 1000);

    const likeButton = await page.$('div[role="dialog"] svg[aria-label="Like]"')
    await likeButton.click()

    await delay(getRandomInt(2,6) * 1000)
    // add to liked accounts
    markLiked(username)
    page.close()
    
}