import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';

interface CreativeProcess {
  id: number;
  name: string;
  img?: string;
}

interface CreativeProcessParams {
  name: string;
  img?: string;
}

interface CreativeProcessState {
  creativeProcesses: CreativeProcess[];
  loading: boolean;
  error: string | null;
  getCreativeProcessById: (id: number) => CreativeProcess | null;
  loadCreativeProcesses: (db: SQLiteDatabase) => Promise<void>;
  createCreativeProcess: (db: SQLiteDatabase, process: CreativeProcessParams) => Promise<number | undefined>;
  updateCreativeProcess: (db: SQLiteDatabase,process: CreativeProcess) => Promise<void>;
  deleteCreativeProcess: (db: SQLiteDatabase,id: number) => Promise<void>;
  
}

export const useCreativeProcessStore = create<CreativeProcessState>((set, get) => ({
  currentCreativeProcessId: null,
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
        'SELECT * FROM creativeprocesses ORDER BY name ASC;'
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