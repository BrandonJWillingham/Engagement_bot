import { search } from './search.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { addFollowed, hasFollowedBefore } from '../helpers/followTracker.js';


export async function followByComment(page, username, depth=0) {
    if (depth > 5) return false
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

            
        const commentElements = await dialog.$$('._a9ym');
        console.log(commentElements);
        if (!commentElements.length) {
        console.log("Error loading comments");
        return;
        }

        // Helper: get the anchor handle and text from a comment element
        const getAnchorAndText = async (commentEl) => {
        const a = await commentEl.$('a');
        if (!a) return { a: null, text: null };
        const text = await a.evaluate(node => node.textContent?.trim() || null);
        return { a, text };
        };

        // Pick a random comment, ensure it's a new account and has an anchor
        let idx = getRandomInt(0, commentElements.length - 1);
        let { a: anchorHandle, text: anchorText } = await getAnchorAndText(commentElements[idx]);

        while (!anchorHandle || !anchorText || anchorText === username || hasFollowedBefore(anchorText)) {
            idx = getRandomInt(0, commentElements.length - 1);
            ({ a: anchorHandle, text: anchorText } = await getAnchorAndText(commentElements[idx]));
        }

        
        // Click through to the commenter profile
        await anchorHandle.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
        await delay(getRandomInt(10, 25) * 158);

        // Follow button: try class first, then fallback to XPath by text
        const followButtonClass = '._ap3a._aaco._aacw._aad6._aade';
        let followButton = await page.$(followButtonClass);
        if (!followButton) {
            const [btnByText] = await page.$x("//button[normalize-space()='Follow']");
            followButton = btnByText || null;
        }
        if (!followButton) {
            console.log('Follow button not found');
            await followByComment(page, username,depth+1)
            return;
        }

        await followButton.click();
        await delay(getRandomInt(1, 5) * 158);

        // record
        addFollowed(anchorText);
        return true;
    } catch (err) {
        console.error(`Error in followByComment for ${username}:`, err);
        await page.keyboard.press('Escape');
    }
}