// differences.js — one job: where every difference lives, per level.
// Coordinates are scene pixels (624 x 432). Each entry names the spot the
// player must click on the RIGHT panel, the radius that counts as a hit,
// and the praise line shown when it is found.

export const DIFFERENCES = {
  kitchen: [
    { id: 'clock', x: 310, y: 62, r: 26, label: 'The clock hands moved!' },
    { id: 'spoon', x: 120, y: 350, r: 20, label: 'A spoon vanished from the counter!' },
    { id: 'mug', x: 462, y: 316, r: 22, label: 'The mug changed colour!' },
    { id: 'apple', x: 246, y: 348, r: 18, label: 'An extra apple appeared in the bowl!' },
    { id: 'tail', x: 556, y: 388, r: 22, label: "The cat's tail is gone!" },
  ],
  garden: [
    { id: 'butterfly', x: 112, y: 112, r: 20, label: 'The butterfly changed colour!' },
    { id: 'bird', x: 516, y: 86, r: 20, label: 'The bird on the fence flew away!' },
    { id: 'spout', x: 172, y: 356, r: 22, label: 'The watering can lost its spout!' },
    { id: 'mushroom', x: 412, y: 376, r: 20, label: 'The mushroom changed colour!' },
    { id: 'bee', x: 296, y: 176, r: 16, label: 'An extra bee joined the garden!' },
    { id: 'stone', x: 244, y: 404, r: 20, label: 'A stepping stone went missing!' },
    { id: 'smile', x: 556, y: 56, r: 24, label: 'The sun lost its smile!' },
  ],
  market: [
    { id: 'lantern', x: 112, y: 86, r: 22, label: 'A lantern changed colour!' },
    { id: 'sign', x: 312, y: 116, r: 20, label: 'The sign gained a dumpling!' },
    { id: 'cat', x: 512, y: 372, r: 22, label: 'The cat on the crate is gone!' },
    { id: 'bulb', x: 216, y: 56, r: 16, label: 'A string-light bulb went dark!' },
    { id: 'umbrella', x: 424, y: 196, r: 22, label: 'The umbrella stripe changed colour!' },
    { id: 'dumpling', x: 172, y: 326, r: 18, label: 'An extra dumpling in the steamer!' },
    { id: 'hat', x: 372, y: 176, r: 20, label: "The vendor's hat changed colour!" },
    { id: 'moon', x: 572, y: 56, r: 22, label: 'The moon changed phase!' },
    { id: 'orange', x: 84, y: 376, r: 18, label: 'An orange rolled off the crate!' },
  ],
};

/** The differences of a level, by its id. */
export function differencesFor(levelId) {
  return DIFFERENCES[levelId] ?? [];
}
