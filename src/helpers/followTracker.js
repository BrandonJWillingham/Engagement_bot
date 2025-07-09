import fs from 'fs';
import path from 'path';

const FOLLOWED_FILE = path.resolve('src/data/followed_users.json');

// Load followed users into memory
let followedUsers = [];
if (fs.existsSync(FOLLOWED_FILE)) {
  followedUsers = JSON.parse(fs.readFileSync(FOLLOWED_FILE));
}

// Save followed users back to the file
function saveFollowed() {
  fs.writeFileSync(FOLLOWED_FILE, JSON.stringify(followedUsers, null, 2));
}

// Add a user with the timestamp
export function addFollowed(username) {
  const timestamp = Date.now();
  followedUsers.push({ username, followedAt: timestamp, deadline: 3 });
  saveFollowed();
}

// Check if user was followed recently (you can tweak 'daysAgo' if you want)
export function hasFollowedBefore(username, daysAgo = 14) {
  const threshold = Date.now() - daysAgo * 24 * 60 * 60 * 1000; // 3 days ago
  return followedUsers.some(
    (user) => user.username === username && user.followedAt > threshold
  );
}
export function changeFollowerDeadline(username, newDeadline = 14){
  const index = followedUsers.findIndex(follower => follower.username == username)
  followedUsers[index].deadline = newDeadline
  saveFollowed()
}
// 🧹 Clean up users older than X days
export function getUsersToUnfollow() {
  return followedUsers.filter((user) =>{
    user.followedAt < Date.now() - user.deadline * 24 * 60 * 60 * 1000
  });
}

// 🧹 Remove unfollowed user from list
export function removeFollowed(username) {
  followedUsers = followedUsers.filter(user => user.username !== username);
  saveFollowed();
}