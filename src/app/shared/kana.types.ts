export interface KanaCell {
  char: string;
  romaji: string;
}

export type KanaRow = (KanaCell | null)[];

export interface KanjiEntry {
  char: string;
  readings_on: string[];
  readings_kun: string[];
  meanings: string[];
  grade?: number;
  jlpt?: number;
}

export type ScriptMode = 'kanji' | 'katakana' | 'hiragana';