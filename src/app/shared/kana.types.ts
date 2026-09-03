export interface KanjiEntry {
  char: string;
  readings_on: string[];
  readings_kun: string[];
  meanings: string[];
  grade?: number;
  jlpt?: number;
}