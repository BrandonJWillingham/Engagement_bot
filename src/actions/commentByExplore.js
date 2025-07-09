import { getRandomInt } from "../helpers/random.js";
import { delay } from "../helpers/delay.js";
import { scrolling } from "../helpers/elementUtils.js";
import { processMedia} from "../helpers/mediaHandler.js";



export async function commentByExplore (page ){

    //click explore button
    const exploreButton = await page.$("svg[aria-label='Explore']")
    await exploreButton.click()
    await delay(getRandomInt(2,10) *148)
    
    const scrollableElement = page.$(".x78zum5.xdt5ytf.xwrv7xz.x1n2onr6.xph46j.xfcsdxf.xsybdxg.x1bzgcud")
    await scrolling(scrollableElement,5)
    await delay(getRandomInt(2,10) *148)

    const posts = page.$$("._aagu")
    const selectedPost = posts[getRandomInt(0,posts.length-1)]
    // await page.evaluate(() => {
        
    // });
    await selectedPost.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    await delay(getRandomInt(2,10) *148)
    await selectedPost.click()

    await delay(getRandomInt(2,10) *148)
    const highlightedPost = page.$(".x9f619.x1n2onr6.x1ja2u2z")

     //if video get video and audio data
    const srcUrl = page.$eval(".x9f619.x1n2onr6.x1ja2u2z", (parent)=>{
        const media = parent.querySelector('video, img')
        return media ? media.src : null;
    }) 


    let comment
    if(srcUrl){
        comment = processMedia(page,srcUrl)
    }
    // record comment and what post commented under
    const commentButton = page.$("svg[aria-label='Comment']")
    await commentButton.click()
    await delay(getRandomInt(1,10)*98)
    // post comment

    await page.waitForSelector('textarea[aria-label="Add a comment…"]'); 
    const commentInput = await page.$('textarea[aria-label="Add a comment…"]');

    await commentInput.type(comment, { delay: 100 });
    await delay(getRandomInt(1,10)*98)
    await commentInput.press("Enter")

    await delay(getRandomInt(1,10)*98)
    await page.keyboard.press('Escape');
}