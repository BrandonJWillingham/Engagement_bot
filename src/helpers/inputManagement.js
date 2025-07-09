import fs from 'fs';
import path from 'path';
import { getRandomInt } from './random.js';
// import { INSPIRED_ACCOUNTS } from '../../Data.js';

const BLACKLIST_FILE = path.resolve('src/data/followed_users.json');
const WHITELIST_FILE = path.resolve('src/data/whitelist.json');
const HASHTAG_FILE = path.resolve('src/data/hashtag.json');
const INSPIRED_FILE = path.resolve('src/data/inspired_accounts.json');
// Load followed users into memory
let inspired_accounts = [];
if (fs.existsSync(INSPIRED_FILE)) {

    console.log("path: ", INSPIRED_FILE)
    inspired_accounts = JSON.parse(fs.readFileSync(INSPIRED_FILE));
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
