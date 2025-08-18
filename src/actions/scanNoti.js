import { autoFollowedAccounts } from "../../Data"
import { delay } from "../helpers/delay"
import { hasFollowedBefore } from "../helpers/followTracker"
import { getRandomInt } from "../helpers/random"
import { likeUserPost } from "./likeUserPost"

export async function scanNoti(page){
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
        return innerText.contains("h") || innerText.contains("m")
    })

    for (const notifi of todayNoti){
        let text = notifi.$eval('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.xyejjpt.x15dsfln.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x1yc453h.x1tu3fi.x3x7a5m.x10wh9bi.xpm28yp.x8viiok.x1o7cslx', el => el.innerText)
        let username = text.split(" ")[0]
        // if liked, will go to page and like something back
        if(text.contains("liked your post") || text.contains("liked your reel") && !likeUserPost(username)){
            let newPage = page.browser().newPage()
            likeUserPost(newPage,username)
        }else if(text.contains("stated following")){
            if(hasFollowedBefore(username)){
                changeFollowerDeadline(username)
            }     
        }
    }
}