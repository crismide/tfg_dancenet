import { Stack } from 'expo-router';
import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { loadDB } from "@/database/database"

export default function Layout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={loadDB}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </SQLiteProvider>
  );
}
