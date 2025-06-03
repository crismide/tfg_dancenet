import { SQLiteDatabase } from "expo-sqlite";

export interface Movement{
    id:number;
    description:string;
    name:string;
    level:string;
    start_time:number;
    end_time:number;
    scene_id:number;
    creativeprocess_id:number;
    }

export interface MovementParams {
    description:string;
    name:string;
    level:string;
    start_time:number;
    end_time:number;
    scene_id:number;
    creativeprocess_id:number;
}

export interface MovementState {
  movements: Movement[];
  loading: boolean;
  error: string | null;
  getMovementById: (id: number) => Movement | null;
  getMovementsOfScene: (id_scene:number) => Movement[] | []
  loadMovements: (db: SQLiteDatabase) => Promise<void>;
  createMovement: (db: SQLiteDatabase, movement: MovementParams) => Promise<number | undefined>;
  updateMovement: (db: SQLiteDatabase,movement: Movement) => Promise<void>;
  deleteMovement: (db: SQLiteDatabase,id: number) => Promise<void>;
}