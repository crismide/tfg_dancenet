import { SQLiteDatabase } from "expo-sqlite";

export interface Space{
    id:number;
    img:string;
    scene_id:number;
    }

export interface SpaceParams {
    img:string;
    scene_id:number;
}

export interface SpaceState {
  spaces: Space[];
  loading: boolean;
  error: string | null;
  getSpaceById: (id: number) => Space | null;
  loadSpaces: (db: SQLiteDatabase) => Promise<void>;
  createSpace: (db: SQLiteDatabase, space: SpaceParams) => Promise<number | undefined>;
  updateSpace: (db: SQLiteDatabase,space: Space) => Promise<void>;
  deleteSpace: (db: SQLiteDatabase,id: number) => Promise<void>;
}