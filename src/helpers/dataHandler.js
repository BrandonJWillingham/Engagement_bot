import fs from 'fs';
import path from 'path';

const WHITELIST_FILE = path.resolve('src/data/whitelist.json');

let whitelist = [];
if (fs.existsSync(WHITELIST_FILE)) {
  whitelist = JSON.parse(fs.readFileSync(WHITELIST_FILE));
}

// Save followed users back to the file
function saveWhitelist() {
  fs.writeFileSync(WHITELIST_FILE, JSON.stringify(whitelist, null, 2));
}

export function onWhitelist(handle){
    const foundName = whitelist.find(name => handle === name)
    return !!foundName
}
  