import { toHiragana, toKatakana } from 'wanakana';
import { KanaCell, KanaRow } from './kana.types';

const GOJUON: (string | null)[][] = [
  ['a','i','u','e','o'],
  ['ka','ki','ku','ke','ko'],
  ['sa','shi','su','se','so'],
  ['ta','chi','tsu','te','to'],
  ['na','ni','nu','ne','no'],
  ['ha','hi','fu','he','ho'],
  ['ma','mi','mu','me','mo'],
  ['ya', null, 'yu', null, 'yo'],
  ['ra','ri','ru','re','ro'],
  ['wa', null, 'wo', null, 'n'],
];

const DAKUTEN_ROWS: string[][] = [
  ['ga','gi','gu','ge','go'],
  ['za','ji','zu','ze','zo'],
  ['da','ji','zu','de','do'],
  ['ba','bi','bu','be','bo'],
  ['pa','pi','pu','pe','po'],
];

const DAKUTEN_OVERRIDES = new Set(['2-1', '2-2']);

const YOON_SEION: string[][] = [
  ['kya', 'kyu', 'kyo'],
  ['sha', 'shu', 'sho'],
  ['cha', 'chu', 'cho'],
  ['nya', 'nyu', 'nyo'],
  ['hya', 'hyu', 'hyo'],
  ['mya', 'myu', 'myo'],
  ['rya', 'ryu', 'ryo'],
];

const YOON_DAKUTEN: string[][] = [
  ['gya', 'gyu', 'gyo'],
  ['ja', 'ju', 'jo'],
  ['bya', 'byu', 'byo'],
  ['pya', 'pyu', 'pyo'],
];

function buildRows(grid: (string | null)[][], toFn: (r: string) => string): KanaRow[] {
  return grid.map(row => row.map(r => (r === null ? null : { char: toFn(r), romaji: r } as KanaCell)));
}

function buildFlat(grid: string[][], toFn: (r: string) => string): KanaCell[] {
  return grid.flatMap((row, i) =>
    row.map((r, j) => {
      const isOverride = DAKUTEN_OVERRIDES.has(`${i}-${j}`);
      const char = isOverride ? (r === 'ji' ? 'ぢ' : 'づ') : toFn(r);
      return { char, romaji: r };
    })
  );
}

function buildYoon(grid: string[][], toFn: (r: string) => string): KanaCell[] {
  return grid.flatMap(row => row.map(r => ({ char: toFn(r), romaji: r })));
}

function hiraToKata(s: string): string {
  return [...s].map(c => String.fromCodePoint(c.codePointAt(0)! + 0x60)).join('');
}

export const hiraganaRows: KanaRow[] = buildRows(GOJUON, toHiragana);
export const katakanaRows: KanaRow[] = buildRows(GOJUON, toKatakana);
export const hiraganaDakuten: KanaCell[] = buildFlat(DAKUTEN_ROWS, toHiragana);
export const katakanaDakuten: KanaCell[] = hiraganaDakuten.map(c => ({ char: hiraToKata(c.char), romaji: c.romaji }));

export const hiraganaSokuon: KanaCell = { char: 'っ', romaji: 'xtsu' };
export const katakanaSokuon: KanaCell = { char: 'ッ', romaji: 'xtsu' };

export const chouonpu: KanaCell = { char: 'ー', romaji: '-' };

export const hiraganaYoon: KanaCell[] = [
  ...buildYoon(YOON_SEION, toHiragana),
  ...buildYoon(YOON_DAKUTEN, toHiragana),
];
export const katakanaYoon: KanaCell[] = [
  ...buildYoon(YOON_SEION, toKatakana),
  ...buildYoon(YOON_DAKUTEN, toKatakana),
];