import { Stack } from 'expo-router';
import React from 'react';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export default function Layout() {
  const createDbIfNeeded = async (db:SQLiteDatabase) => {
    
    console.log("creating db if needed")
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS creativeprocesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        img TEXT);`
    )
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        img TEXT,
        notes TEXT
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS person_creativeprocess (
        person_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (person_id, creativeprocess_id),
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scene_people (
        person_id INTEGER NOT NULL,
        scene_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (person_id, scene_id),
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        typeContent TEXT NOT NULL,
        data TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS idea_creativeprocess (
        idea_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (idea_id, creativeprocess_id),
        FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scene_idea (
        idea_id INTEGER NOT NULL,
        scene_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (idea_id, scene_id),
        FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
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
