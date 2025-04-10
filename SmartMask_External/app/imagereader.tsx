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
import { classifyHealthState } from './healthUtils'; // Update the import statement

const URL = 'https://sdk.photoroom.com/v1/segment';
const FlaskURL = 'http://192.168.1.130:5000/process_image';
const PlaceholderImage = require('../assets/images/background-image.png');
const API_KEY = 'sandbox_0a358aa148144b77bb053d41aff3f19ec948c1b0';

const removeBackground = async (imageUri: string) => {
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

const processWithFlask = async (imageUri: string, retries = 3) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 10 seconds timeout

    const apiResponse = await fetch(FlaskURL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      throw new Error(`Flask API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    return responseData;
  } catch (e) {
    if (retries > 0) {
      console.warn(`Retrying... (${retries} retries left)`);
      return processWithFlask(imageUri, retries - 1);
    } else {
      console.error('Error processing image with Flask:', e);
      Alert.alert('Error', e.message || 'Unknown error occurred');
      return null;
    }
  }
};

export default function ImageReader() {
  const [processedImage, setProcessedImage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [healthMessage, setHealthMessage] = useState<string | undefined>();
  const [detectedPH, setDetectedPH] = useState<number | undefined>();

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
      // Fetch the Flask response (assuming Flask returns pH and health message)
      const flaskResponse = await processWithFlask(fileUri);
      if (flaskResponse) {
        setDetectedPH(flaskResponse.detected_pH);
        setHealthMessage(flaskResponse.health_message);
      }

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

await addResult({
  name: userName,
  imageUri: processedImage,
  timestamp: new Date().toISOString(),
  pH: detectedPH ?? null, // Ensure pH is set to null if detectedPH is undefined
  healthState: classifyHealthState(detectedPH),
});
    Alert.alert('Saved', 'Your result has been saved.');
    setNameModalVisible(false);
    setUserName('');
    router.push('/results');
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
        <Button theme="primary" label="Results History" onPress={() => router.push('/result_history')} />
        {processedImage && <Button theme="primary" label="Results" onPress={() => router.push('/results')} />}
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
            {healthMessage && (
              <Text style={{ color: 'white', marginTop: 10 }}>{healthMessage}</Text>
            )}
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
