import { SQLiteDatabase } from "expo-sqlite";

export interface PersonInScene{
    person_id: number;
    scene_id: number;
    creativeprocess_id: number;
}

export interface PersonInSceneState {
    loading: boolean;
    error: string | null;
    peopleInScenes: PersonInScene[];

    getScenesOfPerson: (id_person:number) => PersonInScene[]
    getPeopleOfScene: (id_scene:number) => PersonInScene[]
    loadPeopleInScenes: (db: SQLiteDatabase) => Promise<void>
    putPersonInScene: (db: SQLiteDatabase,person_id: number, creativeprocess_id: number, scene_id: number) => Promise<void>;
    deletePersonFromScene: (db: SQLiteDatabase,person_id: number, scene_id: number) => Promise<void>;
    deletePeopleFromScenesOfCreativeProcess: (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => Promise<void>;
}