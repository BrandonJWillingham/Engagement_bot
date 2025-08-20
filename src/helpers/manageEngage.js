const actionLimits = {
    follow: { maxPerHour: 10, timestamps: [] },
    scan: { maxPerHour: 5, timestamps: [] },
    viewStories: { maxPerHour: 40, timestamps: [] },
    unfollowOldUsers: {maxPerHour:10,timestamps: []},
    scroll:{maxPerHour:5,timestamps:[]},
    like:{maxPerHour:20,timestamps:[]}
};


export function pruneOldTimestamps(timestamps) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return timestamps.filter(ts => ts > oneHourAgo);
}

export function canPerformAction(action) {
      const limit = actionLimits[action];
    if (!limit) {
    console.warn(`Unknown action: ${action}`);
    return false; // or true, depending on how you want to handle it
  }
    actionLimits[action].timestamps = pruneOldTimestamps(actionLimits[action].timestamps);
    return actionLimits[action].timestamps.length < actionLimits[action].maxPerHour;
}

export function logActionTimestamp(action) {
    actionLimits[action].timestamps.push(Date.now());
}
