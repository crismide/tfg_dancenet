import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import create from 'zustand';

const db = useSQLiteContext()

interface CreativeProcess {
  id: number;
  name: string;
  img?: string;
}

interface CreativeProcessState {
  currentCreativeProcessId: number | null;
  creativeProcesses: CreativeProcess[];
  loading: boolean;
  error: string | null;
  setCurrentCreativeProcess: (id: number) => void;
  clearCurrentCreativeProcess: () => void;
  loadCreativeProcesses: (db: SQLiteDatabase) => Promise<void>;
  createCreativeProcess: (db: SQLiteDatabase, process: Omit<CreativeProcess, 'id'>) => Promise<void>;
  updateCreativeProcess: (db: SQLiteDatabase, process: CreativeProcess) => Promise<void>;
  deleteCreativeProcess: (db: SQLiteDatabase, id: number) => Promise<void>;
  getCurrentCreativeProcess: () => CreativeProcess | null;
}

export const useCreativeProcessStore = create((set, get) => ({
    currentCreativeProcessId: null,
    creativeProcesses: [],
    loading: false,
    error: null,

    // Set the current creative process
    setCurrentCreativeProcess: (id: number) => {
      set({ currentCreativeProcessId: id });
    },

    // Clear the current creative process
    clearCurrentCreativeProcess: () => {
      set({ currentCreativeProcessId: null });
    },

    // Get the current creative process object
    getCurrentCreativeProcess: (): CreativeProcess | null => {
      const { currentCreativeProcessId, creativeProcesses } = get();
      if (!currentCreativeProcessId) return null;
      return creativeProcesses.find(p => p.id === currentCreativeProcessId) || null;
    },

    // Load all creative processes
    loadCreativeProcesses: async () => {
      set({ loading: true, error: null });
      try {
        const result = await db.getAllAsync<CreativeProcess>(
          'SELECT * FROM creativeprocesses ORDER BY name ASC;'
        );
        set({ creativeProcesses: result, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    // Create a new creative process
    createCreativeProcess: async (process: Omit<CreativeProcess, 'id'>) => {
      set({ loading: true, error: null });
      try {
        await db.runAsync(
          'INSERT INTO creativeprocesses (name, img) VALUES (?, ?);',
          [process.name, process.img || null]
        );
        
        // Refresh the list
        await get().loadCreativeProcesses(db);
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    // Update a creative process
    updateCreativeProcess: async (process: CreativeProcess) => {
      set({ loading: true, error: null });
      try {
        await db.runAsync(
          'UPDATE creativeprocesses SET name = ?, img = ? WHERE id = ?;',
          [process.name, process.img || null, process.id]
        );
        
        // Refresh the list
        await get().loadCreativeProcesses(db);
        
        // If we're updating the current process, ensure our local state is updated
        const { currentCreativeProcessId } = get();
        if (currentCreativeProcessId === process.id) {
          set({ currentCreativeProcessId: process.id });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    // Delete a creative process
    deleteCreativeProcess: async (id: number) => {
      set({ loading: true, error: null });
      try {
        await db.runAsync('DELETE FROM creativeprocesses WHERE id = ?;', [id]);
        
        // Refresh the list
        await get().loadCreativeProcesses(db);
        
        // If we're deleting the current process, clear it
        const { currentCreativeProcessId } = get();
        if (currentCreativeProcessId === id) {
          set({ currentCreativeProcessId: null });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
  })
);