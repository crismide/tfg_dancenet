import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const AudioPickerRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionsGranted(status === 'granted');
    })();
  }, []);

  const resetAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setAudioUri(null);
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
  };

  // Handle audio playback
  const handlePlayback = async () => {
    if (!audioUri) return;

    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      await resetAudio();  // Clear previous audio
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
      await resetAudio();  // Clear previous audio

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        setAudioUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking audio file', err);
    }
  };

  // Format time display
  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
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
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickAudioFile}
          className="items-center p-4 bg-blue-100 rounded-lg"
        >
          <FontAwesome name="file-audio-o" size={32} color="#3b82f6" />
          <Text className="mt-2 text-blue-500">Pick Audio File</Text>
        </TouchableOpacity>
      </View>

      {/* Playback Controls */}
      {audioUri && (
        <View className="mt-8">
          <Text className="text-lg font-semibold mb-4 text-gray-700">
            {recording ? "New Recording" : "Selected Audio"}
          </Text>

          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={async value => {
              if (sound) {
                await sound.setPositionAsync(value);
              }
            }}
            thumbTintColor="#3b82f6"
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#ddd"
          />

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-600">{formatTime(position)}</Text>
            <Text className="text-gray-600">{formatTime(duration)}</Text>
          </View>

          <TouchableOpacity
            onPress={handlePlayback}
            className="self-center mt-4 p-4 bg-green-100 rounded-full"
          >
            <FontAwesome
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#10b981"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AudioPickerRecorder;