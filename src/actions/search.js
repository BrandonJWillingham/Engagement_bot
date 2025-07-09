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

        const results = await page.$$('.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3'); // Consider tightening selector
        if (results.length === 0) throw new Error("No search results found");

        await results[0].click();
        await delay(getRandomInt(2, 5) * 1000);
    } catch (error) {
        console.error(`Search failed for query "${query}":`, error.message);
    }
}