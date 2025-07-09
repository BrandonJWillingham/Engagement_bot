import { followByLike } from './followByLike.js';
import {followByComment} from './followByComment.js'
import { unfollowOldUsers } from './unfollowOld.js';
import { delay } from '../helpers/delay.js';
import { getRandomInt } from '../helpers/random.js';
import { canPerformAction,logActionTimestamp } from '../helpers/manageEngage.js'; 
import { getRandomInsp } from '../helpers/inputManagement.js';
import {commentByReel} from './commentByReel.js';
import {commentByExplore} from './commentByExplore.js'
import {mindlessScroll} from './mindlessScroll.js';
import { viewStories } from './viewStory.js';


export async function engage(page) {
    console.log("Starting engagement session...");
    const maxDuration = 10 * 60 * 1000; // 10 minutes
    const startTime = Date.now();

    const actions = ["comment", "viewStories","unfollowOldUsers","scroll"];

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
        switch ("comment") {
            case "follow":
                const account = getRandomInsp();
                 selector = getRandomInt(1,2)
                if(selector > 1){
                    await followByLike(page, account);    
                }else{
                    await followByComment(page, account);
                }
                break;
            case "comment":
                 selector = getRandomInt(1,2)
                 selector = 1
                if(selector > 1){
                    await commentByExplore(page);    
                }else{
                    await commentByReel(page);
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
        }

        logActionTimestamp(chosenAction);
        await delay(getRandomInt(5, 15) * 1000);
    }

    console.log("✅ Engagement session ended.");
}