import {findLowestMissing} from "../helpers/findLowest.js";
import { getRandomInt } from "../helpers/random.js";
import { delay } from "../helpers/delay.js";
import { onWhitelist } from "../helpers/dataHandler.js";

export async function viewStories(page) {
    const homeButton = await page.$('svg[aria-label="Home"]');
    if (homeButton) {
        await homeButton.click();
        await delay(getRandomInt(1, 9) * 1384);
        await page.reload();
        await delay(getRandomInt(1, 9) * 1254);
    } else {
        console.error("Home button not found!");
        return;
    }

    await page.waitForSelector("li._acaz");

    const profiles = await page.$$("div.xpyat2d li._acaz");
    const viewedStories = [];
    const skippedIndices = new Set();

    for (let i = 0; i < profiles.length; i++) {
        const instaHandleEl = await profiles[i].$('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
        if (!instaHandleEl) {
            console.warn(`No insta handle found for profile at index ${i}`);
            continue;
        }

        const instaHandle = await page.evaluate(el => el.textContent, instaHandleEl);
        const whitelisted = onWhitelist(instaHandle);

        if (instaHandle !== "Your Story" && !whitelisted) {
            viewedStories.push(instaHandle);
        }

        if (whitelisted) {
            skippedIndices.add(i);
        }
    }

    let current = findLowestMissing([...skippedIndices]);

    try {
        while (current < profiles.length) {
            console.log(`Checking profile at index ${current}...`);

            const updatedProfiles = await page.$$("div.xpyat2d li._acaz");
            const currentProfile = updatedProfiles[current];
            if (!currentProfile) {
                console.warn(`No profile found at index ${current}`);
                break;
            }

            // Check for sponsored tag
            const sponsoredEl = await currentProfile.$("span.x1fhwpqd.x132q4wb.x1g9anri");
            if (sponsoredEl) {
                const sponsoredTag = await page.evaluate(el => el.textContent, sponsoredEl);
                if (sponsoredTag === "Sponsored") {
                    console.log("Skipping sponsored profile");
                    current++;
                    continue;
                }
            }

            // Check for overlay
            const overlay = await page.$("div.x1n2onr6.x1vjfegm");
            console.log("Overlay present:", !!overlay);
            if (!overlay) {
                console.log(`Attempting to click profile at index ${current}...`);
                await currentProfile.click();
                console.log(`Clicked profile at index ${current}`);
            }

            // Handle stories per user
            await page.waitForSelector('.x1lix1fw.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x1iyjqo2.x36qwtl.x6ikm8r.x10wlt62.x1n2onr6');
            const storiesPerUser = await page.$$('.x1lix1fw.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x1iyjqo2.x36qwtl.x6ikm8r.x10wlt62.x1n2onr6');
            for (let i = 0; i < storiesPerUser.length; i++) {
                await delay(getRandomInt(5, 15) * 234);
                await page.keyboard.press('ArrowRight');
            }

            // Update current index
            if (skippedIndices.has(current + 1)) {
                current = findLowestMissing([...skippedIndices], current + 1);
                console.log("Skipped index found, new current:", current);
                await page.keyboard.press('Escape');
            } else {
                current++;
                console.log("Next index:", current);
            }
        }
    } catch (err) {
        console.error(`Error clicking profile at index ${current}:`, err);
    } finally {
        await page.keyboard.press('Escape');
    }
}