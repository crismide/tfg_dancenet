import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { IdeaInScene, IdeaInSceneState } from "@/interfaces/interfaceSceneIdea"

export const useSceneIdeaStore = create<IdeaInSceneState>((set,get) => ({
    loading : false,
    error : null,
    ideasInScenes : [],

    getScenesOfIdea: (id_idea) => {
        const { ideasInScenes } = get()
        return ideasInScenes.filter(cp => cp.idea_id === id_idea) || [];
    },

    loadIdeasInScenes: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<IdeaInScene>(
            'SELECT * FROM scene_idea ORDER BY typeContent ASC;'
            );
            set({ ideasInScenes: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },

    putIdeaInScene: async (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number, scene_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO scene_idea (idea_id, scene_id, creativeprocess_id) VALUES (?, ?)',[idea_id, scene_id, creativeprocess_id])
            await get().loadIdeasInScenes(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

    deleteIdeaFromScene: async (db: SQLiteDatabase,idea_id: number, scene_id: number) => {
      set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM scene_idea WHERE idea_id = ? AND scene_id = ?;',[idea_id, scene_id])
            await get().loadIdeasInScenes(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },

    deleteIdeasFromScenesOfCreativeProcess: async (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number) => {
        try {
            await db.runAsync('DELETE FROM scene_idea WHERE idea_id = ? AND creativeprocess_id = ?;',[idea_id, creativeprocess_id])
            await get().loadIdeasInScenes(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },

}))