/**
 * Shared color classes for strategy number badges.
 * Used in both StrategyCard (workspace) and CitationBadge (chat)
 * so that the same strategy number always gets the same color.
 *
 * First 8 are hand-picked for maximum contrast with each other
 * while complementing the warm/earthy palette. 9-20 fill out
 * the spectrum for unlikely edge cases.
 */
/** Raw hex values for each badge — used for CSS custom properties */
export const BADGE_HEX = [
  '#3a6d5b', // 1  forest green (primary)
  '#d94f2d', // 2  terracotta (accent)
  '#4a6fa5', // 3  slate blue
  '#b8860b', // 4  dark goldenrod
  '#7b5ea7', // 5  plum
  '#2a8a8a', // 6  teal
  '#c44569', // 7  rose
  '#8b5e3c', // 8  sienna
  '#5a7d4e', // 9  olive
  '#a0522d', // 10 burnt sienna
  '#3d6b8e', // 11 steel blue
  '#9b7b2c', // 12 antique gold
  '#6a4c93', // 13 purple
  '#3a8f7c', // 14 jade
  '#b5485f', // 15 berry
  '#6b7045', // 16 moss
  '#c26840', // 17 copper
  '#5b6abf', // 18 periwinkle
  '#8c6e5d', // 19 mocha
  '#4e8a6e', // 20 sage
] as const;

export const BADGE_COLORS = [
  'bg-[#3a6d5b]', // 1  forest green (primary)
  'bg-[#d94f2d]', // 2  terracotta (accent)
  'bg-[#4a6fa5]', // 3  slate blue
  'bg-[#b8860b]', // 4  dark goldenrod
  'bg-[#7b5ea7]', // 5  plum
  'bg-[#2a8a8a]', // 6  teal
  'bg-[#c44569]', // 7  rose
  'bg-[#8b5e3c]', // 8  sienna
  'bg-[#5a7d4e]', // 9  olive
  'bg-[#a0522d]', // 10 burnt sienna
  'bg-[#3d6b8e]', // 11 steel blue
  'bg-[#9b7b2c]', // 12 antique gold
  'bg-[#6a4c93]', // 13 purple
  'bg-[#3a8f7c]', // 14 jade
  'bg-[#b5485f]', // 15 berry
  'bg-[#6b7045]', // 16 moss
  'bg-[#c26840]', // 17 copper
  'bg-[#5b6abf]', // 18 periwinkle
  'bg-[#8c6e5d]', // 19 mocha
  'bg-[#4e8a6e]', // 20 sage
] as const;

/** Hover variants matching BADGE_COLORS order */
export const BADGE_HOVER_COLORS = [
  'hover:bg-[#2d574a]', // 1
  'hover:bg-[#b63e22]', // 2
  'hover:bg-[#3d5d8c]', // 3
  'hover:bg-[#9a7009]', // 4
  'hover:bg-[#664d8c]', // 5
  'hover:bg-[#227373]', // 6
  'hover:bg-[#a63856]', // 7
  'hover:bg-[#754e32]', // 8
  'hover:bg-[#4a6740]', // 9
  'hover:bg-[#8a4425]', // 10
  'hover:bg-[#335a78]', // 11
  'hover:bg-[#836724]', // 12
  'hover:bg-[#573f7c]', // 13
  'hover:bg-[#2f7968]', // 14
  'hover:bg-[#9a3c4f]', // 15
  'hover:bg-[#5a5e3a]', // 16
  'hover:bg-[#a55635]', // 17
  'hover:bg-[#4b58a3]', // 18
  'hover:bg-[#765c4d]', // 19
  'hover:bg-[#40755c]', // 20
] as const;

/** Active/pressed variants matching BADGE_COLORS order */
export const BADGE_ACTIVE_COLORS = [
  'bg-[#2d574a]', // 1
  'bg-[#b63e22]', // 2
  'bg-[#3d5d8c]', // 3
  'bg-[#9a7009]', // 4
  'bg-[#664d8c]', // 5
  'bg-[#227373]', // 6
  'bg-[#a63856]', // 7
  'bg-[#754e32]', // 8
  'bg-[#4a6740]', // 9
  'bg-[#8a4425]', // 10
  'bg-[#335a78]', // 11
  'bg-[#836724]', // 12
  'bg-[#573f7c]', // 13
  'bg-[#2f7968]', // 14
  'bg-[#9a3c4f]', // 15
  'bg-[#5a5e3a]', // 16
  'bg-[#a55635]', // 17
  'bg-[#4b58a3]', // 18
  'bg-[#765c4d]', // 19
  'bg-[#40755c]', // 20
] as const;
