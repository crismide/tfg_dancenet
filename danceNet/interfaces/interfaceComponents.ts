import { SQLiteDatabase } from "expo-sqlite";

export interface ErrorScreenProps {
  error: string;
}

export interface EditDeleteButtonsProps{
  typeObject:string;
  deleteFunction: (db: SQLiteDatabase, id: number) => Promise<void> | void;
  id:number;
  editActive?:boolean
}

export interface PreviewIdeaProps{
  typeContent:string;
  data:string;
  id:number;
  source:string;
  id_process?:number;
  id_scene?:number;
}