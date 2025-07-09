const fs = require('fs');
const path = require('path');

const COMMENTS_FILE = path.resolve('src/data/comments.json');

// Declare the comments array
let comments = [];

// Check if the comments file exists and load it if so
if (fs.existsSync(COMMENTS_FILE)) {
    comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
}

// Function to save the comments array to a file
function saveComment() {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// Function to add a new comment
function addComment(comment) {
    comments.push({
        comment: comment,
        time: Date.now() // Get the current timestamp
    });
    saveComment();
}

module.exports = { addComment };