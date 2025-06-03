import { SQLiteDatabase } from "expo-sqlite";

export interface PersonInCreativeProcess{
    person_id:number;
    creativeprocess_id:number;
    }

export interface PersonInCreativeProcessState {
    loading: boolean;
    error: string | null;
    peopleInCreativeProcesses: PersonInCreativeProcess[];

    getCreativeProcessesOfPerson: (id_person: number) => PersonInCreativeProcess[];
    getPeopleOfCreativeProcess: (id_creativeprocess: number) => PersonInCreativeProcess[]
    loadPeopleInCreativeProcesses: (db: SQLiteDatabase) => Promise<void>
    putPersonInCreativeProcess: (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => Promise<void>;
    deletePersonFromCreativeProcess: (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => Promise<void>;
    updateCreativeProcessesForPerson: (db: SQLiteDatabase,person_id: number, creativeprocess_ids: number[]) => Promise<void>;
    updatePeopleForCreativeProcess: (
    db: SQLiteDatabase,
    creativeprocess_id: number,
    person_ids: number[]
    ) => Promise<void>;
}