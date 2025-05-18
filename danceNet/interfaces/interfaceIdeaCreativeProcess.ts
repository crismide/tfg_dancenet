import { SQLiteDatabase } from "expo-sqlite";

export interface IdeaInCreativeProcess{
    idea_id:number;
    creativeprocess_id:number;
    }

export interface IdeaInCreativeProcessState {
    loading: boolean;
    error: string | null;
    ideasInCreativeProcesses: IdeaInCreativeProcess[];

    getCreativeProcessesOfIdea: (id_idea: number) => IdeaInCreativeProcess[];
    getIdeasOfCreativeProcess: (id_idea: number) => IdeaInCreativeProcess[];
    loadIdeasInCreativeProcesses: (db: SQLiteDatabase) => Promise<void>
    putIdeaInCreativeProcess: (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => Promise<number | undefined>;
    deleteIdeaFromCreativeProcess: (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => Promise<void>;
}