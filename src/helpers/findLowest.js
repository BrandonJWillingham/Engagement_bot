export function findLowestMissing(arr,startingPoint = 0) {

    const numSet = new Set(arr);
    for (let i = startingPoint; i <= arr.length; i++) {
        if (!numSet.has(i)) return i;
    }
    return -1
}