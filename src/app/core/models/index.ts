import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Category = Tables<'categories'>;
export type CategoryInsert = TablesInsert<'categories'>;
export type CategoryUpdate = TablesUpdate<'categories'>;

export type UserProfile = Tables<'users'>;
export type UserProfileInsert = TablesInsert<'users'>;
export type UserProfileUpdate = TablesUpdate<'users'>;

export type Word = Tables<'words'>;
export type WordInsert = TablesInsert<'words'>;
export type WordUpdate = TablesUpdate<'words'>;