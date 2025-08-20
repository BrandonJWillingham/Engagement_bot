import { delay } from "../helpers/delay.js";
import { getRandomInt } from "../helpers/random.js";

export async function search(page, query) {
    try {
        const searchIcon = await page.$('svg[aria-label="Search"]');
        if (!searchIcon) throw new Error("Search icon not found");

        await searchIcon.click();
        await delay(getRandomInt(3, 10) * 500);

        const input = await page.$('input[placeholder="Search"]');
        if (!input) throw new Error("Search input not found");

        await input.click({ clickCount: 3 });
        await input.type(query);
        await delay(getRandomInt(4, 8) * 500);

        const container = await page.$(".x6s0dn4.x78zum5.xdt5ytf.x5yr21d.x1odjw0f.x1n2onr6.xh8yej3")
        if (!container) throw new Error("Search dialog not found");

        const results = await container.$$('a');
        if (results.length === 0) throw new Error("No search results found");

        await results[0].click();
        await delay(getRandomInt(2, 5) * 1000);
    } catch (error) {
        console.error(`Search failed for query "${query}":`, error.message);
    }
}