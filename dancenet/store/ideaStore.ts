import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Idea,IdeaParams,IdeaState } from "@/interfaces/interfaceIdea"

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  loading: false,
  error: null,

  getIdeaById: (id: number) => {
    const { ideas } = get();
    return ideas.find(cp => cp.id === id) || null;
  },

  loadIdeas: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Idea>(
        'SELECT * FROM ideas;'
      );
      set({ ideas: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createIdea: async (db: SQLiteDatabase, idea: IdeaParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO ideas (typeContent, data) VALUES (?, ?);',
        [idea.typeContent, idea.data || null]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadIdeas(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateIdea: async (db: SQLiteDatabase,idea: Idea) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE ideas SET typeContent = ?, data = ? WHERE id = ?;',
        [idea.typeContent, idea.data || null, idea.id]
      );
      await get().loadIdeas(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteIdea: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM ideas WHERE id = ?;', [id]);
      await get().loadIdeas(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));