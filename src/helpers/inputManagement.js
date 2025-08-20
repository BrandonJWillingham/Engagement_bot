import fs from 'fs';
import path from 'path';
import { getRandomInt } from './random.js';
// import { INSPIRED_ACCOUNTS } from '../../Data.js';

const BLACKLIST_FILE = path.resolve('src/data/followed_users.json');
const WHITELIST_FILE = path.resolve('src/data/whitelist.json');
const HASHTAG_FILE = path.resolve('src/data/hashtag.json');
const INSPIRED_FILE = path.resolve('src/data/inspired_accounts.json');
const LIKED_PROFILES_FILE = path.resolve('src/data/liked_profiles.json')
const ONE_DAY = 24*60*60*1000;


// Load followed users into memory
let inspired_accounts = [];
if (fs.existsSync(INSPIRED_FILE)) {
    inspired_accounts = JSON.parse(fs.readFileSync(INSPIRED_FILE));
}

let liked_profiles = { }
if(fs.existsSync(LIKED_PROFILES_FILE)){
    liked_profiles = JSON.parse(fs.readFileSync(LIKED_PROFILES_FILE));
}

let hashtag = [];
if (fs.existsSync(HASHTAG_FILE)) {
    hashtag = JSON.parse(fs.readFileSync(HASHTAG_FILE));
}

let whitelist = [];
if (fs.existsSync(WHITELIST_FILE)) {
    whitelist = JSON.parse(fs.readFileSync(WHITELIST_FILE));
}

let blacklist = [];
if (fs.existsSync(BLACKLIST_FILE)) {
    blacklist = JSON.parse(fs.readFileSync(BLACKLIST_FILE));
}

export function getRandomInsp (){
    return inspired_accounts[getRandomInt(0,inspired_accounts.length -1)]
}

export function getRandomHash(){
    return hashtag[getRandomInt(0,hashtag.length-1)]
}
export function markLiked(username){
    const time = Date.now()
    liked_profiles[username] = time
}

export function likedOneDayAgo(username){
    const lastLiked = liked_profiles[username]; // timestamp in ms
    if (!lastLiked) return false; // never liked before
    const now = Date.now();
    return (now - lastLiked) >= ONE_DAY;
}

export function onWhitelist(username){
    return whitelist.includes(username)
}
export function saveData() {
    fs.writeFileSync(LIKED_PROFILES_FILE, JSON.stringify(LIKED_PROFILES_FILE, null, 2));
    fs.writeFileSync(INSPIRED_FILE, JSON.stringify(inspired_accounts, null, 2));
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify(whitelist, null, 2));
    fs.writeFileSync(HASHTAG_FILE, JSON.stringify(hashtag, null, 2));
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(blacklist, null, 2));
}