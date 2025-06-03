import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AudioPlayerProps } from '@/interfaces/interfaceComponents';

const AudioPlayer = ({ audioUri }: AudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup on unmount or when audioUri changes
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setPosition(0);
  };

  // Load audio metadata to get duration without playing
  const loadAudioMetadata = async () => {
    if (!audioUri || sound) return;
    
    setIsLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false } // Don't auto-play
      );
      
      setSound(newSound);
      
      // Set up status update listener to get duration
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
      
      // Get initial status to set duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setDuration(status.durationMillis);
      }
    } catch (error) {
      console.error('Error loading audio metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioUri) {
      loadAudioMetadata();
    }
    
    return () => {
      stopAudio();
    };
  }, [audioUri]);

  useFocusEffect(
    useCallback(() => {
      console.log('Tab is focused');
      
      return () => {
        console.log('Tab is unfocused');
        stopAudio();
      };
    }, [sound])
  );

  // Handle audio playback
  const handlePlayback = async () => {
    if (!audioUri || !sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Format time display
  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  if (!audioUri) return null;

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-1 mr-4">
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={async value => {
              if (sound) {
                await sound.setPositionAsync(value);
              }
            }}
            thumbTintColor="#C286F1"
            minimumTrackTintColor="#C286F1"
            maximumTrackTintColor="#C286F1"
            disabled={isLoading || !sound}
          />
        </View>
        <TouchableOpacity
          onPress={handlePlayback}
          className="p-4"
          disabled={isLoading || !sound}
        >
          {isLoading ? (
            <FontAwesome name="spinner" size={24} color="#C286F1" />
          ) : (
            <FontAwesome
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#C286F1"
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600">{formatTime(position)}</Text>
        <Text className="text-gray-600">
          {isLoading ? "Loading..." : formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

export default AudioPlayer;