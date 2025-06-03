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

    getIdeasOfScene: (id_scene:number) => {
        const { ideasInScenes } = get()
        return ideasInScenes.filter(pair => pair.scene_id === id_scene) || [];
    },

    loadIdeasInScenes: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<IdeaInScene>(
            'SELECT * FROM scene_idea;'
            );
            set({ ideasInScenes: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },

    putIdeaInScene: async (db: SQLiteDatabase,idea_id: number, creativeprocess_id: number, scene_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO scene_idea (idea_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',[idea_id, scene_id, creativeprocess_id])
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
    updateScenesOfIdea: async ( db: SQLiteDatabase, idea_id: number, scenes: { scene_id: number, creativeprocess_id: number }[]) => {
        set({ loading: true, error: null });
        try {
            await db.runAsync('DELETE FROM scene_idea WHERE idea_id = ?', [idea_id]);
            for (const { scene_id, creativeprocess_id } of scenes) {
                await db.runAsync(
                    'INSERT INTO scene_idea (idea_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',
                    [idea_id, scene_id, creativeprocess_id]
                );
            }
            await get().loadIdeasInScenes(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    updateIdeasOfScenes: async ( db: SQLiteDatabase,scene_id: number, creativeprocess_id: number, idea_ids: number[]
    ) => {
        set({ loading: true, error: null });
        try {
            // Remove all ideas for this scene and creative process
            await db.runAsync(
                'DELETE FROM scene_idea WHERE scene_id = ? AND creativeprocess_id = ?',
                [scene_id, creativeprocess_id]
            );
            // Insert new ideas
            for (const idea_id of idea_ids) {
                await db.runAsync(
                    'INSERT INTO scene_idea (idea_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',
                    [idea_id, scene_id, creativeprocess_id]
                );
            }
            await get().loadIdeasInScenes(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

}))