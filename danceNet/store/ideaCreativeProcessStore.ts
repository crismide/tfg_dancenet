import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { IdeaInCreativeProcess, IdeaInCreativeProcessState } from "@/interfaces/interfaceIdeaCreativeProcess"

export const useIdeaCreativeProcessStore = create<IdeaInCreativeProcessState>((set,get) => ({
    ideasInCreativeProcesses: [],
    loading: false,
    error: null,

    getCreativeProcessesOfIdea: (id_idea: number) => {
        const { ideasInCreativeProcesses } = get();
        return ideasInCreativeProcesses.filter(cp => cp.idea_id === id_idea) || [];
    },

    getIdeasOfCreativeProcess: (id_process: number) => {
        const { ideasInCreativeProcesses } = get();
        return ideasInCreativeProcesses.filter(pair => pair.creativeprocess_id === id_process) || [];
    },

    loadIdeasInCreativeProcesses: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
            try {
                const result = await db.getAllAsync<IdeaInCreativeProcess>(
                'SELECT * FROM idea_creativeprocess;'
                );
                set({ ideasInCreativeProcesses: result, loading: false });
            } catch (error: any) {
                set({ error: error?.message || String(error), loading: false });
            }
    },

    putIdeaInCreativeProcess: async (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => {
        set({ loading: true, error: null })
        try {
            const result = await db.runAsync('INSERT INTO idea_creativeprocess (idea_id, creativeprocess_id) VALUES (?, ?)',[idea_id, creativeprocess_id])
            const lastInsertId = result.lastInsertRowId;
            await get().loadIdeasInCreativeProcesses(db)
            set({ loading: false })
            return lastInsertId
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

    deleteIdeaFromCreativeProcess: async (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM idea_creativeprocess WHERE idea_id = ? AND creativeprocess_id = ?;',[idea_id, creativeprocess_id])
            await get().loadIdeasInCreativeProcesses(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    }
}))