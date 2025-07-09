import {} from ""
import { HASHTAGS } from "../../Data";
import { imageUrlToBase64 } from "../helpers/imgTo64";
import { CHATGPT_API_KEY } from "../config/constants";


export async function likeAndCommentPosts(page) {
    try {
        const tag = HASHTAGS[getRandomInt(0, HASHTAGS.length - 1)];
        await search(page, `#${tag}`);

        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await delay(getRandomInt(2, 5) * 1000);

        const posts = await page.$$('article img');
        const postIndex = getRandomInt(0, posts.length - 1);

        const post = posts[postIndex];
        const imgUrl = await post.evaluate(img => img.src);
        const base64 = await imageUrlToBase64(imgUrl);

        await post.click();
        await delay(2000);
        
        const client = new OpenAI({ apiKey: CHATGPT_API_KEY});
        const prompt = `Write a witty Instagram comment for this image: ${base64}`;
        const response = await client.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }]
        });

        const commentText = response.choices[0].message.content.trim();

        const commentBox = await page.$("textarea[aria-label='Add a comment…']");
        await commentBox.type(commentText);
        await delay(1000);

        const postButton = await page.$('button[type="submit"]');
        await postButton.click();

        for (let i = 0; i < getRandomInt(2, 4); i++) {
            await like();
            await nextPost();
        }

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
