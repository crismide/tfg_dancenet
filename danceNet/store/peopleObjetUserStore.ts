import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { ObjectOfPerson, ObjectOfPersonState } from "@/interfaces/interfacePeopleObjectUser"

export const usePeopleObjectUserStore = create<ObjectOfPersonState>((set,get) => ({
    loading: false,
    error: null,
    objectsInPeople: [],

    getPeopleOfObject: (id_object: number) => {
        const { objectsInPeople } = get()
        return objectsInPeople.filter(pair => pair.object_id === id_object) || []
    },

    loadObjectsOfPeople: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<ObjectOfPerson>(
            'SELECT * FROM people_object_user;'
            );
            set({ objectsInPeople: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },
    putObjectOfPerson: async (db: SQLiteDatabase,person_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO people_object_user (person_id, object_id) VALUES (?, ?)',[person_id, object_id])
            await get().loadObjectsOfPeople(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    deleteObjectOfPerson: async (db: SQLiteDatabase,person_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM people_object_user WHERE person_id = ? AND object_id = ?;',[person_id, object_id])
            await get().loadObjectsOfPeople(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },
    updatePeopleForObject: async ( db: SQLiteDatabase, object_id: number, person_ids: number[]) => {
        set({ loading: true, error: null });
        try {
            await db.runAsync('DELETE FROM people_object_user WHERE object_id = ?', [object_id]);
            for (const person_id of person_ids) {
            await db.runAsync(
                'INSERT INTO people_object_user (person_id, object_id) VALUES (?, ?)',
                [person_id, object_id]
            );
            }
            await get().loadObjectsOfPeople(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

}))