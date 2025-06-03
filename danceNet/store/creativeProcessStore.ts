import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { CreativeProcess,CreativeProcessParams,CreativeProcessState } from "@/interfaces/interfaceCreativeProcess"


export const useCreativeProcessStore = create<CreativeProcessState>((set, get) => ({
  creativeProcesses: [],
  loading: false,
  error: null,

  getCreativeProcessById: (id: number) => {
  const { creativeProcesses } = get();
  return creativeProcesses.find(cp => cp.id === id) || null;
  },


  loadCreativeProcesses: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<CreativeProcess>(
        'SELECT * FROM creativeprocesses;'
      );
      set({ creativeProcesses: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createCreativeProcess: async (db: SQLiteDatabase, process: CreativeProcessParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO creativeprocesses (name, img) VALUES (?, ?);',
        [process.name, process.img || null]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadCreativeProcesses(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateCreativeProcess: async (db: SQLiteDatabase,process: CreativeProcess) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE creativeprocesses SET name = ?, img = ? WHERE id = ?;',
        [process.name, process.img || null, process.id]
      );
      await get().loadCreativeProcesses(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteCreativeProcess: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM creativeprocesses WHERE id = ?;', [id]);
      await get().loadCreativeProcesses(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));