import { SQLiteDatabase } from "expo-sqlite";

export interface ObjectOfResponsiblePerson{
    object_id:number;
    person_id:number;
}

export interface ObjectOfResponsiblePersonState {
    loading: boolean;
    error: string | null;
    objectsInResponsiblePeople: ObjectOfResponsiblePerson[];

    getResponsiblePeopleOfObject: (id_object: number) => ObjectOfResponsiblePerson[];
    loadObjectsOfResponsiblePeople: (db: SQLiteDatabase) => Promise<void>
    putObjectOfResponsiblePerson: (db: SQLiteDatabase,object_id: number, person_id: number) => Promise<void>;
    deleteObjectOfResponsiblePerson: (db: SQLiteDatabase,object_id: number, person_id: number) => Promise<void>;
    updateResPeopleForObject: ( db: SQLiteDatabase, object_id: number, person_ids: number[]) => Promise<void>;
}