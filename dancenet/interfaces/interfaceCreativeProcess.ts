import { SQLiteDatabase } from "expo-sqlite";

export interface CreativeProcess {
  id: number;
  name: string;
  img?: string;
}

export interface CreativeProcessParams {
  name: string;
  img?: string;
}

export interface CreativeProcessState {
  creativeProcesses: CreativeProcess[];
  loading: boolean;
  error: string | null;
  getCreativeProcessById: (id: number) => CreativeProcess | null;
  loadCreativeProcesses: (db: SQLiteDatabase) => Promise<void>;
  createCreativeProcess: (db: SQLiteDatabase, process: CreativeProcessParams) => Promise<number | undefined>;
  updateCreativeProcess: (db: SQLiteDatabase,process: CreativeProcess) => Promise<void>;
  deleteCreativeProcess: (db: SQLiteDatabase,id: number) => Promise<void>;
}
