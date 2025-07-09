import { autoFollowedAccounts } from "../../Data"
import { delay } from "../helpers/delay"
import { hasFollowedBefore } from "../helpers/followTracker"
import { getRandomInt } from "../helpers/random"
export async function scanForFollow(page){
    const notiBtn = await page.$("svg[aria-label='Notifications']")
    notiBtn.click()
    await delay(getRandomInt(10,100)*100)

    const notis = await page.$$('.x6s0dn4.x1q4h3jn.x78zum5.x1y1aw1k.xxbr6pl.xwib8y2.xbbxn1n.x87ps6o.x1wq6e7o.x1di1pr7.x1h4gsww.xux34ky.x1ypdohk.x1l895ks')
    if(!notis){
        console.log("No new notifications")
        return
    }

    const todayNoti = notis.filter((element)=>{
        let htmlTag = element.$('abbr')
        let innerText = page.evaluate(el => el.innerHTML, htmlTag)
        return innerText.contains("h")
    })

    await todayNoti.forEach(element => {
        let button = element.$('button')
        let buttonText = page.evaluate(el=> el.innerHTML, button)

        let profile = element.$('._ap3a._aaco._aacw._aacx._aad7._aade')
        let username = page.evaluate(el=> el.innerHTML,profile)
        if(buttonText == "Following"){
            if(hasFollowedBefore(username)){
                changeFollowerDeadline(username)
            }     
        }

    });

}