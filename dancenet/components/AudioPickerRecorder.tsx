import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AudioPlayer from './AudioPlayer';

interface AudioPickerRecorderProps {
  isFocused: boolean;
  onAudioSelected: (uri: string) => void;
}

const AudioPickerRecorder = ({ isFocused, onAudioSelected }: AudioPickerRecorderProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionsGranted(status === 'granted');
    })();
  }, []);

  const resetAudio = () => {
    setAudioUri(null);
  };

  // Start recording
  const startRecording = async () => {
    try {
      resetAudio();  // Clear previous audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setAudioUri(uri);
        onAudioSelected(uri); // Send URI to parent
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setRecording(null);
    }
  };

  // Pick audio file
  const pickAudioFile = async () => {
    try {
      if (recording) {
        await stopRecording();  // Stop any ongoing recording
      }
      resetAudio();  // Clear previous audio

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        setAudioUri(result.assets[0].uri);
        onAudioSelected(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking audio file', err);
    }
  };

  return (
    <View>
      {/* Recording/Picking Section */}
      <View className="flex-row justify-center space-x-4 mb-8">
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          className="items-center p-4 bg-red-100 rounded-lg"
          disabled={!permissionsGranted}
        >
          <MaterialIcons
            name={recording ? "stop" : "mic"}
            size={32}
            color={permissionsGranted ? "#ef4444" : "#999"}
          />
          <Text className="mt-2 text-red-500">
            {recording ? "Parar grabación" : "Empezar grabación"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickAudioFile}
          className="items-center p-4 bg-blue-100 rounded-lg"
        >
          <FontAwesome name="file-audio-o" size={32} color="#3b82f6" />
          <Text className="mt-2 text-blue-500">Elige un archivo de audio</Text>
        </TouchableOpacity>
      </View>

      {/* Audio Player */}
      <AudioPlayer 
        audioUri={audioUri} 
        isFocused={isFocused}
      />
    </View>
  );
};

export default AudioPickerRecorder;