import { search } from './search.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { addFollowed, hasFollowedBefore } from '../helpers/followTracker.js';
import { scrolling } from '../helpers/elementUtils.js';


export async function followByLike(page, username) {
    try {
        await search(page, `@${username}`);
        await page.waitForSelector('._aagu');
        await delay(getRandomInt(2, 5) * 1000);

        const postElements = await page.$$('._aagu');
        if (postElements.length < 2) {
            console.log('Not enough posts to engage with.');
            return;
        }

        const targetPost = postElements[getRandomInt(0,postElements.length)];
        await targetPost.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await delay(getRandomInt(2, 5) * 1000);

        await targetPost.click();
        await delay(getRandomInt(2, 5) * 1000);

        await page.waitForSelector('svg[aria-label="Like"]');
        await delay(getRandomInt(2, 5) * 1000);

        // Open list of users who liked the post
        const likedByButton = await page.$('.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.xpm28yp.x8viiok.x1o7cslx');
        if (!likedByButton) {
            console.log('Could not find likes list button.');
            await page.keyboard.press('Escape');
            return;
        }
        await likedByButton.click();
        await delay(getRandomInt(2, 5) * 1000);

        await page.waitForSelector('.x1qnrgzn.x1cek8b2.xb10e19.x19rwo8q.x1lliihq.x193iq5w.xh8yej3');
        await delay(getRandomInt(3, 9) * 522);

        //scroll to get more user Elements
        const scrollingSelector = ".html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x9f619.x1jols5v.xjbqb8w.x78zum5.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1n2onr6.x6ikm8r.x10wlt62.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div"
        await scrolling(page,scrollingSelector,getRandomInt(2,20) )
        await delay(getRandomInt(3, 9) * 522)


        const userElements = await page.$$('.x1qnrgzn.x1cek8b2.xb10e19.x19rwo8q.x1lliihq.x193iq5w.xh8yej3');
        console.log("userButtons: ", userElements)
        for (let element of userElements) {
            console.log("userElements: ", element)
            const followButton = await element.$('._ap3a._aaco._aacw._aad6._aade')
            const innerText = await followButton.evaluate(el => el.innerHTML);
            console.log("text: ",innerText)
            if (innerText.trim() === 'Follow') {
                const usernameElement = await element.$('._ap3a._aaco._aacw._aacx._aad7._aade');
                const targetUsername = await page.evaluate(el => el.innerHTML, usernameElement);
                console.log("username: ",targetUsername)
                if (hasFollowedBefore(targetUsername)) {
                    console.log(`Already followed recently: ${targetUsername}`);
                    continue;
                }
                await followButton.click();
                addFollowed(targetUsername);
                console.log(`Followed ${targetUsername} from likes list.`);
                await delay(getRandomInt(1, 3) * 1000);
                break; // follow only one per call
            }
        }

        await page.keyboard.press('Escape'); // Close dialog
        await delay(getRandomInt(1, 3) * 1000);
        await page.keyboard.press('Escape'); // Close post
        await delay(getRandomInt(1, 3) * 1000);
        return true;

    } catch (err) {
        console.error(`Error in followByLike for ${username}:`, err);
        await page.keyboard.press('Escape');
    }
}