import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { ObjectOfResponsiblePerson, ObjectOfResponsiblePersonState } from "@/interfaces/interfacePeopleObjectResponsible"

export const usePeopleObjectResponsibleStore = create<ObjectOfResponsiblePersonState>((set,get) => ({
    loading: false,
    error: null,
    objectsInResponsiblePeople: [],

    getResponsiblePeopleOfObject: (id_object: number) => {
        const { objectsInResponsiblePeople } = get()
        return objectsInResponsiblePeople.filter(pair => pair.object_id === id_object) || []
    },

    loadObjectsOfResponsiblePeople: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<ObjectOfResponsiblePerson>(
            'SELECT * FROM people_object_responsible;'
            );
            set({ objectsInResponsiblePeople: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },
    putObjectOfResponsiblePerson: async (db: SQLiteDatabase,person_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO people_object_responsible (person_id, object_id) VALUES (?, ?)',[person_id, object_id])
            await get().loadObjectsOfResponsiblePeople(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    deleteObjectOfResponsiblePerson: async (db: SQLiteDatabase,person_id: number, object_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM people_object_responsible WHERE person_id = ? AND object_id = ?;',[person_id, object_id])
            await get().loadObjectsOfResponsiblePeople(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },
    updateResPeopleForObject: async ( db: SQLiteDatabase, object_id: number, person_ids: number[]) => {
        set({ loading: true, error: null });
        try {
            await db.runAsync('DELETE FROM people_object_responsible WHERE object_id = ?', [object_id]);
            for (const person_id of person_ids) {
            await db.runAsync(
                'INSERT INTO people_object_responsible (person_id, object_id) VALUES (?, ?)',
                [person_id, object_id]
            );
            }
            await get().loadObjectsOfResponsiblePeople(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

}))