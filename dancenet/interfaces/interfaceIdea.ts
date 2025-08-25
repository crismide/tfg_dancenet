import { SQLiteDatabase } from "expo-sqlite";

export interface Idea{
    id:number;
    typeContent:string;
    data:string;
    }

export interface IdeaParams {
    typeContent:string;
    data:string;
}

export interface IdeaState {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  getIdeaById: (id: number) => Idea | null;
  loadIdeas: (db: SQLiteDatabase) => Promise<void>;
  createIdea: (db: SQLiteDatabase, idea: IdeaParams) => Promise<number | undefined>;
  updateIdea: (db: SQLiteDatabase,idea: Idea) => Promise<void>;
  deleteIdea: (db: SQLiteDatabase,id: number) => Promise<void>;
}