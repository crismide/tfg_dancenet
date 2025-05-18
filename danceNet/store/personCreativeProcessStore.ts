import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { PersonInCreativeProcess, PersonInCreativeProcessState } from '@/interfaces/interfacepersonCreativeProcess';

export const usePersonCreativeProcessStore = create<PersonInCreativeProcessState>((set,get) => ({
    peopleInCreativeProcesses: [],
    loading: false,
    error: null,
    
    getCreativeProcessesOfPerson: (id_person: number) => {
        const { peopleInCreativeProcesses } = get()
        return peopleInCreativeProcesses.filter(pair => pair.person_id === id_person) || []
    },

    getPeopleOfCreativeProcess: (id_creativeprocess: number) => {
        const { peopleInCreativeProcesses } = get()
        return peopleInCreativeProcesses.filter(pair => pair.creativeprocess_id === id_creativeprocess) || []
    },

    loadPeopleInCreativeProcesses: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
            try {
                const result = await db.getAllAsync<PersonInCreativeProcess>(
                'SELECT * FROM person_creativeprocess;'
                );
                set({ peopleInCreativeProcesses: result, loading: false });
            } catch (error: any) {
                set({ error: error?.message || String(error), loading: false });
            }
    },
    putPersonInCreativeProcess: async (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO person_creativeprocess (person_id, creativeprocess_id) VALUES (?, ?)',[person_id, creativeprocess_id])
            await get().loadPeopleInCreativeProcesses(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    deletePersonFromCreativeProcess: async (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM person_creativeprocess WHERE person_id = ? AND creativeprocess_id = ?;',[person_id, creativeprocess_id])
            await get().loadPeopleInCreativeProcesses(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    }

    
}))