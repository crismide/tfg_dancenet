import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { ObjectOfMovement, ObjectOfMovementState } from "@/interfaces/interfaceMovementObjects"

export const useMovementObjectsStore = create<ObjectOfMovementState>((set,get) => ({
    loading: false,
    error: null,
    objectsInMovements: [],

    getObjectsOfMovements: (id_movement: number) => {
        const { objectsInMovements } = get()
        return objectsInMovements.filter(pair => pair.movement_id === id_movement) || []
    },
    getMovementsOfObjects: (id_object: number) => {
        const { objectsInMovements } = get()
        return objectsInMovements.filter(pair => pair.object_id === id_object) || []
    },
    loadObjectsOfMovements: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<ObjectOfMovement>(
            'SELECT * FROM movement_object;'
            );
            set({ objectsInMovements: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },
    putObjectOfMovement: async (db: SQLiteDatabase,movement_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO movement_object (movement_id, object_id) VALUES (?, ?)',[movement_id, object_id])
            await get().loadObjectsOfMovements(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    deleteObjectsOfMovements: async (db: SQLiteDatabase,movement_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM movement_object WHERE movement_id = ? AND object_id = ?;',[movement_id, object_id])
            await get().loadObjectsOfMovements(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    }

}))