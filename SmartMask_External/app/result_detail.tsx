import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

export default function ResultDetail() {
  const { name, imageUri, timestamp, pH, healthState } = useLocalSearchParams();
  const router = useRouter();

   // Parse pH safely as a number
   const parsedPH = pH ? parseFloat(pH as string) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.timestamp}>{new Date(timestamp as string).toLocaleString()}</Text>
      <Image source={{ uri: imageUri as string }} style={styles.image} />
      <Text style={styles.pH}>pH: {pH != null ? parsedPH.toFixed(2) : 'N/A'}</Text>
      <Text style={[styles.healthState, getHealthStateStyle(healthState)]}>{healthState || 'Unknown'}</Text>

      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

// Define getHealthStateStyle to adjust the color based on the healthState
const getHealthStateStyle = (healthState) => {
  switch (healthState) {
    case 'Healthy':
      return { color: '#00ab41' }; // Green for healthy
    case 'Slight Risk':
      return { color: '#FFDE21' }; // Yellow for slight risk
    case 'Abnormal':
      return { color: '#ff0000' }; // Red for abnormal
    default:
      return { color: '#aaa' }; // Grey for unknown
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  timestamp: {
    color: '#ccc',
    marginBottom: 20,
  },
  pH: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  healthState: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
});
