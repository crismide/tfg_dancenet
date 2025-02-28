import { Stack } from 'expo-router';
import React from 'react';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export default function Layout() {
  const createDbIfNeeded = async (db:SQLiteDatabase) => {
    console.log("creating db if needed")
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS creativeprocesses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, img TEXT);"
    )
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
  }

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </SQLiteProvider>
  );
}
