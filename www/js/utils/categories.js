export const CATEGORY_EMOJIS = {
    'Preserves': '🫐',
    'Honey': '🍯',
    'Tea': '🍵',
    'Skincare': '🧴',
    'Gifts': '🎁'
};

export const DEFAULT_EMOJI = '📦';

export function getEmoji(category) {
    return CATEGORY_EMOJIS[category] || DEFAULT_EMOJI;
}

export const CATEGORIES = Object.keys(CATEGORY_EMOJIS);
