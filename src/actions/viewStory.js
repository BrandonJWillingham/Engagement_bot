import { getRandomInt } from "../helpers/random.js";
import { delay } from "../helpers/delay.js";

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

    const profiles = await page.$$('[aria-label^="story by " i]');
    if(!profiles) return console.log("error finding profiles")

    await profiles[0].click()
    await delay(getRandomInt(100,500)*10)

    for(let i =0; i<profiles.length-1;i++){

        //check if sponsered post
        const sponseredTag = await page.$(".xyzq4qe.x5a5i1n.x1obq294.x5yr21d.x6ikm8r.x10wlt62.x1n2onr6.x87ps6o.xh8yej3.x1ja2u2z .x1fhwpqd.x132q4wb.x1g9anri")
        if(sponseredTag){
            i--
            await delay(getRandomInt(100,300)*10)
            await page.keyboard.press('ArrowRight')
            continue
        }

        const storiesPerUser = await page.$$(".x1lix1fw.xr9e8f9.x1e4oeot.x1ui04y5.x6en5u8.x1iyjqo2.x36qwtl.x6ikm8r.x10wlt62.x1n2onr6")
        if(!storiesPerUser) return console.log("error grabbing stories per user")


        if(storiesPerUser.length > 1){

            for( let j=0;j< storiesPerUser.length;j++){

                await delay(getRandomInt(100,300)*10)
                await page.keyboard.press('ArrowRight')

            }

        }else{

            await delay(getRandomInt(100,300)*10)
            await page.keyboard.press('ArrowRight')

        }
    }

    await delay(getRandomInt(100,300)*10)
    await page.keyboard.press('Escape')
}