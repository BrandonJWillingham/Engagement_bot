import { followByLike } from './followByLike.js';
import {followByComment} from './followByComment.js'
import { scanNoti } from './scanNoti.js';
import { unfollowOldUsers } from './unfollowOld.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { canPerformAction,logActionTimestamp } from '../helpers/manageEngage.js'; 
import { getRandomInsp, saveData } from '../helpers/inputManagement.js';
import {mindlessScroll} from './mindlessScroll.js';
import { viewStories } from './viewStory.js';
import { likeByHash } from './likePost.js';


export async function engage(page) {
    console.log("Starting engagement session...");
    const maxDuration = 10 * 60 * 1000; // 10 minutes
    const startTime = Date.now();

    const actions = ["follow", "viewStories","unfollowOldUsers","scroll","scan","like"];

    while (Date.now() - startTime < maxDuration) {
        const availableActions = actions.filter(canPerformAction);

        if (availableActions.length === 0) {
            console.log("⚠️ No available actions due to rate limits. Waiting...");
            await delay(60 * 1000); // Wait a minute before checking again
            continue;
        }

        const chosenAction = availableActions[getRandomInt(0, availableActions.length - 1)];
        console.log(`⏩ Performing: ${chosenAction}`);

        let selector
        switch (chosenAction) {
            case "follow":
                const account = getRandomInsp();
                 selector = getRandomInt(1,2)
                if(selector > 1){
                    await followByLike(page, account);    
                }else{
                    await followByComment(page, account);
                }
                break;
            case "viewStories":
                await viewStories(page);
                break;
            case "scroll":
                await mindlessScroll(page);
                break;
            case "unfollowOldUsers":
                await unfollowOldUsers(page)
                break;
            case "scan":
                await scanNoti(page)
                break;
            case "like":
                await likeByHash(page)
                break;
        }

        logActionTimestamp(chosenAction);
        await delay(getRandomInt(5, 15) * 1000);
    }
    saveData()
    console.log("✅ Engagement session ended.");
}