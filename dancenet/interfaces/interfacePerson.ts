import { SQLiteDatabase } from "expo-sqlite";

export interface Person{
    id:number;
    name:string;
    img:string;
    notes:string;
    }

export interface PersonParams {
    name:string;
    img:string;
    notes:string;
}

export interface PersonState {
  people: Person[];
  loading: boolean;
  error: string | null;
  getPersonById: (id: number) => Person | null;
  loadPeople: (db: SQLiteDatabase) => Promise<void>;
  createPerson: (db: SQLiteDatabase, person: PersonParams) => Promise<number | undefined>;
  updatePerson: (db: SQLiteDatabase,person: Person) => Promise<void>;
  deletePerson: (db: SQLiteDatabase,id: number) => Promise<void>;
}