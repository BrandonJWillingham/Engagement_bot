const actionLimits = {
    follow: { maxPerHour: 10, timestamps: [] },
    comment: { maxPerHour: 2, timestamps: [] },
    viewStories: { maxPerHour: 40, timestamps: [] },
    unfollowOldUsers: {maxPerHour:10,timestamps: []},
    scroll:{maxPerHour:5,timestamps:[]},
};


export function pruneOldTimestamps(timestamps) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return timestamps.filter(ts => ts > oneHourAgo);
}

export function canPerformAction(action) {
    actionLimits[action].timestamps = pruneOldTimestamps(actionLimits[action].timestamps);
    return actionLimits[action].timestamps.length < actionLimits[action].maxPerHour;
}

export function logActionTimestamp(action) {
    actionLimits[action].timestamps.push(Date.now());
}
