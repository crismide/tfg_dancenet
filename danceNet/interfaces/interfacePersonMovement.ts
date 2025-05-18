import { SQLiteDatabase } from "expo-sqlite";

export interface PersonWithMovement{
    person_id: number, 
    movement_id: number, 
    creativeprocess_id: number 
}

export interface PersonWithMovementState{
    loading: boolean;
    error: string | null;
    peopleWithMovements: PersonWithMovement[]

    getPeopleOfMovements: (id_movement: number) => PersonWithMovement[];
    loadPeopleWithMovements: (db: SQLiteDatabase) => Promise<void>
    putPersonWithMovement: (db: SQLiteDatabase,person_id: number, movement_id:number, creativeprocess_id: number) => Promise<void>;
    deleteMovementOfPerson: (db: SQLiteDatabase,person_id: number, movement_id: number) => Promise<void>;
}