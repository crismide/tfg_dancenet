import * as FileSystem from 'expo-file-system';

/**
 * Saves an audio file to the app's document directory and returns the new file path.
 * @param data The URI or path of the audio file to save.
 * @returns The new file path where the audio is saved.
 * @throws Error if the file cannot be saved.
 */
export async function getPathAudioFile(data: string): Promise<string> {
  const audioDir = `${FileSystem.documentDirectory}audio/`;
  await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
  const timestamp = new Date().getTime();
  const fileExtension = data.startsWith('content://') ? 'mp3' : data.includes('.') ? data.split('.').pop() : 'wav';
  const filename = `audio_${timestamp}.${fileExtension}`;
  const newPath = `${audioDir}${filename}`;

  if (data.startsWith('content://')) {
    await FileSystem.copyAsync({ from: data, to: newPath });
  } else {
    await FileSystem.moveAsync({ from: data, to: newPath });
  }
  return newPath;
}