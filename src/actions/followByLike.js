import { search } from './search.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { addFollowed, hasFollowedBefore } from '../helpers/followTracker.js';


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
        await targetPost.click();
        await page.waitForSelector('svg[aria-label="Like"]');
        await delay(getRandomInt(2, 5) * 1000);

        // Open list of users who liked the post
        const likedByButton = await page.$('.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj');
        if (!likedByButton) {
            console.log('Could not find likes list button.');
            await page.keyboard.press('Escape');
            return;
        }

        await likedByButton.click();
        await page.waitForSelector('.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3');
        await delay(getRandomInt(3, 9) * 522);

        const userButtons = await page.$$('.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3');
        console.log("userButtons: ", userButtons)
        for (let button of userButtons) {
            console.log("userButtons: ", userButtons)
            const followButton = await button.$('._ap3a._aaco._aacw._aad6._aade')
            const innerText = await followButton.evaluate(el => el.innerHTML);
            console.log("text: ",innerText)
            if (innerText.trim() === 'Follow') {
                const usernameElement = await button.$('._ap3a._aaco._aacw._aacx._aad7._aade');
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
        return true;

    } catch (err) {
        console.error(`Error in followByLike for ${username}:`, err);
        await page.keyboard.press('Escape');
    }
}