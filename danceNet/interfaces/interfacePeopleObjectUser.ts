import { SQLiteDatabase } from "expo-sqlite";

export interface ObjectOfPerson{
    object_id:number;
    person_id:number;
}

export interface ObjectOfPersonState {
    loading: boolean;
    error: string | null;
    objectsInPeople: ObjectOfPerson[];

    getPeopleOfObject: (id_object: number) => ObjectOfPerson[];
    loadObjectsOfPeople: (db: SQLiteDatabase) => Promise<void>
    putObjectOfPerson: (db: SQLiteDatabase,object_id: number, person_id: number) => Promise<void>;
    deleteObjectOfPerson: (db: SQLiteDatabase,object_id: number, person_id: number) => Promise<void>;
    updatePeopleForObject: ( db: SQLiteDatabase, object_id: number, person_ids: number[]) => Promise<void>;
}