import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { PersonWithMovement, PersonWithMovementState } from "@/interfaces/interfacePersonMovement"

export const usePersonMovementStore = create<PersonWithMovementState>((set,get) => ({
    loading: false,
    error: null,
    peopleWithMovements: [],

    getPeopleOfMovements: (id_movement: number) => {
        const { peopleWithMovements } = get();
        return peopleWithMovements.filter(pair => pair.movement_id === id_movement ) || []
    },
    
    loadPeopleWithMovements: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
            try {
                const result = await db.getAllAsync<PersonWithMovement>(
                'SELECT * FROM person_movement;'
                );
                set({ peopleWithMovements: result, loading: false });
            } catch (error: any) {
                set({ error: error?.message || String(error), loading: false });
            }
    },
    putPersonWithMovement: async (db: SQLiteDatabase,person_id: number, movement_id:number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO person_movement (person_id, movement_id ) VALUES (?, ?)',[person_id, movement_id])
            await get().loadPeopleWithMovements(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    deleteMovementOfPerson: async (db: SQLiteDatabase,person_id: number, movement_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM person_movement WHERE person_id = ? AND movement_id = ?;',[person_id, movement_id])
            await get().loadPeopleWithMovements(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    updatePeopleForMovement: async ( db: SQLiteDatabase, movement_id: number, person_ids: number[]) => {
        // Start loading
        set({ loading: true, error: null });
        try {
            // Remove all old associations
            await db.runAsync(
            `DELETE FROM person_movement WHERE movement_id = ?`,
            [movement_id]
            );
            // Insert new associations
            for (const person_id of person_ids) {
            await db.runAsync(
                `INSERT INTO person_movement (person_id, movement_id) VALUES (?, ?)`,
                [person_id, movement_id]
            );
            }
            // Refresh state
            await get().loadPeopleWithMovements(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
}))