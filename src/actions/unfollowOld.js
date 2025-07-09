import { getUsersToUnfollow, removeFollowed } from '../helpers/followTracker.js';
import { delay } from '../helpers/delay.js';

export async function unfollowOldUsers(page) {
  const usersToUnfollow = getUsersToUnfollow(3); // 3 days

  for (let user of usersToUnfollow) {
    await page.goto(`https://www.instagram.com/${user.username}/`);
    await delay(3000);

    const unfollowButton = await page.$('text="Following"');
    if (unfollowButton) {
      await unfollowButton.click();
      await delay(1000);
      const confirmButton = await page.$('text="Unfollow"');
      if (confirmButton) {
        await confirmButton.click();
        console.log(`Unfollowed ${user.username}`);
        removeFollowed(user.username);
        await delay(2000);
        break
      }
    }
  }
}