import { SQLiteDatabase } from "expo-sqlite";

export interface Object{
    id:number;
    img:string;
    scene_id:number;
    creativeprocess_id:number;
    }

export interface ObjectParams {
    img:string;
    scene_id:number;
    creativeprocess_id:number;
}

export interface ObjectState {
  objects: Object[];
  loading: boolean;
  error: string | null;
  getObjectById: (id: number) => Object | null;
  loadObjects: (db: SQLiteDatabase) => Promise<void>;
  createObject: (db: SQLiteDatabase, object: ObjectParams) => Promise<number | undefined>;
  updateObject: (db: SQLiteDatabase,object: Object) => Promise<void>;
  deleteObject: (db: SQLiteDatabase,id: number) => Promise<void>;
}