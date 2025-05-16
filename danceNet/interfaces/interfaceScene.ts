import { SQLiteDatabase } from "expo-sqlite";

export interface Scene{
    id:number;
    name:string;
    creativeprocess_id:number;
    }

export interface SceneParams {
    name: string;
    creativeprocess_id:number;
}

export interface SceneState {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
  getSceneById: (id: number) => Scene | null;
  loadScenes: (db: SQLiteDatabase) => Promise<void>;
  createScene: (db: SQLiteDatabase, scene: SceneParams) => Promise<number | undefined>;
  updateScene: (db: SQLiteDatabase,scene: Scene) => Promise<void>;
  deleteScene: (db: SQLiteDatabase,id: number) => Promise<void>;
}