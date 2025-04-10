import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Button as RNButton,
  ScrollView,
} from 'react-native';
import Button from '../assets/Components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useResults } from './ResultsContext';
import { classifyHealthState } from './results';


const URL = 'https://sdk.photoroom.com/v1/segment';
const PlaceholderImage = require('../assets/images/imagereader_placeholder.jpg');
const API_KEY = 'sandbox_fd48f847b70fe7befcc4ace1afd9d7f21b1e48d1';

export const removeBackground = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('image_file', {
      uri: imageUri,
      name: 'image.png',
      type: 'image/png',
    } as any);

    const apiResponse = await fetch(URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    return responseData.result_b64;
  } catch (e) {
    console.error('Error processing image:', e);
    Alert.alert('Error', e.message || 'Unknown error occurred');
    return null;
  }
};

export default function ImageReader() {
  const [processedImage, setProcessedImage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const router = useRouter();
  const { addResult } = useResults();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      processImage(imageUri);
    } else {
      Alert.alert('No Image Selected', 'You did not select any image.');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsLoading(true);
    const bgRemovedImage = await removeBackground(imageUri);
    if (bgRemovedImage) {
      const base64Image = `data:image/png;base64,${bgRemovedImage}`;
      const filename = `${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, bgRemovedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setProcessedImage(fileUri);
      setNameModalVisible(true);
    } else {
      Alert.alert('Processing Failed', 'Could not remove background.');
    }
    setIsLoading(false);
  };

  const saveToMemory = async () => {
    if (!userName || !processedImage) {
      Alert.alert('Missing Info', 'Please enter your name and try again.');
      return;
    }

    // 🔹 Set pH manually (later fetch from Python) Change to set on Python
    const pH = 7;  

    await addResult({
      name: userName,
      imageUri: processedImage,
      timestamp: new Date().toISOString(),
      pH: pH,
      healthState: classifyHealthState(pH),
    });

    Alert.alert('Saved', 'Your result has been saved.');
    setNameModalVisible(false);
    setUserName('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : processedImage ? (
          <Image source={{ uri: processedImage }} style={styles.resultImage} />
        ) : (
          <Image source={PlaceholderImage} style={styles.resultImage} />
        )}
      </View>

      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button theme="primary" label="Results" onPress={() => router.push('/results')} />
        <Button theme="primary" label="Results History" onPress={() => router.push('/result_history')} />
      </View>

      <Modal visible={nameModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: 'white', marginBottom: 10 }}>Enter your name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#aaa"
              value={userName}
              onChangeText={setUserName}
            />
            <RNButton title="Save Result" onPress={saveToMemory} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 200,
    marginBottom: 10,
    borderRadius: 5,
    color: 'white',
  },
});
