const SMALL_YOON = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const SOKUON = new Set(['っ', 'ッ']);
const CHOONPU = 'ー';

export function splitIntoKanaUnits(value: string): string[] {
  const chars = Array.from(value ?? '');
  const units: string[] = [];
  let i = 0;
  while (i < chars.length) {
    let unit = chars[i];
    i++;
    if (SOKUON.has(unit) && i < chars.length) {
      unit += chars[i];
      i++;
    }
    while (i < chars.length && SMALL_YOON.has(chars[i])) {
      unit += chars[i];
      i++;
    }
    while (i < chars.length && chars[i] === CHOONPU) {
      unit += chars[i];
      i++;
    }
    units.push(unit);
  }
  return units;
}