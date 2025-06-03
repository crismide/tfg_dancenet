import { SQLiteDatabase } from "expo-sqlite";

export interface ObjectOfMovement{
    movement_id:number;
    object_id:number;
}

export interface ObjectOfMovementState {
    loading: boolean;
    error: string | null;
    objectsInMovements: ObjectOfMovement[];

    getObjectsOfMovements: (id_movement: number) => ObjectOfMovement[];
    getMovementsOfObjects: (id_object: number) => ObjectOfMovement[];
    loadObjectsOfMovements: (db: SQLiteDatabase) => Promise<void>
    putObjectOfMovement: (db: SQLiteDatabase,movement_id: number, object_id: number) => Promise<void>;
    deleteObjectsOfMovements: (db: SQLiteDatabase,movement_id: number, object_id: number) => Promise<void>;
    updateMovementsForObject: ( db: SQLiteDatabase, object_id: number, movement_ids: number[])=> Promise<void>;
}