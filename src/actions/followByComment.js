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

        const scrollingElement = await targetPost.$(".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1")
        let i = 0
        let limit = getRandomInt(5,20)
        do{
            i++
            await scrollingElement.evaluate(el => {
            el.scrollTop += 200;  // Scroll down by 500px
            }); 
            await delay(getRandomInt(1, 5) * 158);
        }
        while(scrollingElement.scrollHeight > scrollingElement.scrollHeight + 200 || i > limit)

        const commentElements = scrollingElement.$$('._a9ym')
        let commentElement = await commentElements[getRandomInt(0,commentElements.length -1)]
        let anchorText = await page.evaluate(() => {
            const anchor = commentElement.querySelector('a');
            return anchor ? anchor.innerText.trim() : null;
        });
   
        // if the user is the listed user or has been followed before grab another comment
        while( username == anchorText || hasFollowedBefore(anchorText)){
            commentElement = await commentElements[getRandomInt(0,commentElements.length -1)]
            anchorText = await page.evaluate(() => {
                const anchor = commentElement.querySelector('a');
                return anchor ? anchor.innerText.trim() : null;
            }); 
        }
        const anchor = commentElement.querySelector('a');
        anchorText = await page.evaluate(() => {
            const anchor = commentElement.querySelector('a');
            return anchor ? anchor.innerText.trim() : null;
        }); 
        addFollowed(anchorText)
        anchor.click()

        const followButtonClass = "._ap3a._aaco._aacw._aad6._aade"
        await page.waitForSelector(followButtonClass)

        const followButton = page.$(followButtonClass)
        followButton.click()
        await delay(getRandomInt(1, 5) * 158)

        return true;

    } catch (err) {
        console.error(`Error in followByComment for ${username}:`, err);
        await page.keyboard.press('Escape');
    }
}