import { SQLiteDatabase } from "expo-sqlite";

export interface IdeaInScene{
    idea_id: number;
    scene_id: number;
    creativeprocess_id: number;
}

export interface IdeaInSceneState {
    loading: boolean;
    error: string | null;
    ideasInScenes: IdeaInScene[];

    getScenesOfIdea: (id_idea:number) => IdeaInScene[]
    loadIdeasInScenes: (db: SQLiteDatabase) => Promise<void>
    putIdeaInScene: (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number, scene_id: number) => Promise<void>;
    deleteIdeaFromScene: (db: SQLiteDatabase,idea_id: number, scene_id: number) => Promise<void>;
    deleteIdeasFromScenesOfCreativeProcess: (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => Promise<void>;
}