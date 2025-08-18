import { search } from './search.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { addFollowed, hasFollowedBefore } from '../helpers/followTracker.js';


export async function followByComment(page, username) {
    try {

        await search(page, `@${username}`);
        let postElementClass = '._aagu'
        await page.waitForSelector(postElementClass);
        await delay(getRandomInt(5, 15) * 158);
        const postElements = await page.$$(postElementClass);
        if (postElements.length < 2) {
            console.log('Not enough posts to engage with.');
            return;
        }

        const targetPost = postElements[getRandomInt(0,postElements.length-1)];
        await targetPost.click();
        await delay(getRandomInt(10, 25) * 158);

        const dialog = await page.$("div[role='dialog']")
        while(true){
            const loadMore = await dialog.$('svg[aria-label="Load more comments"]');
            if(!loadMore)break;

            await loadMore.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
            await loadMore.click()
            await delay(getRandomInt(10, 25) * 158);
        }

        const commentElements = await dialog.$$('._a9ym')
        let commentElement = await commentElements[getRandomInt(0,commentElements.length -1)]
        let anchorText = await dialog.evaluate(() => {
            const anchor = commentElement.querySelector('a');
            return anchor ? anchor.innerText.trim() : null;
        });
   
        // if the user is the listed user or has been followed before grab another comment
        while( username === anchorText || hasFollowedBefore(anchorText)){
            commentElement = await commentElements[getRandomInt(0,commentElements.length -1)]
            anchorText = await dialog.evaluate(() => {
                const anchor = commentElement.querySelector('a');
                return anchor ? anchor.innerText.trim() : null;
            }); 
        }
        const anchor = await commentElement.querySelector('a');
        anchorText = await page.evaluate(async () => {
            const anchor = await commentElement.querySelector('a');
            return anchor ? anchor.innerText.trim() : null;
        }); 
         addFollowed(anchorText)
        await anchor.click()
        await delay(getRandomInt(10, 25) * 158);

        const followButtonClass = "._ap3a._aaco._aacw._aad6._aade"
        await page.waitForSelector(followButtonClass)
        const followButton = await page.$(followButtonClass)
        await followButton.click()
        await delay(getRandomInt(1, 5) * 158)

        return true;
    } catch (err) {
        console.error(`Error in followByComment for ${username}:`, err);
        await page.keyboard.press('Escape');
    }
}