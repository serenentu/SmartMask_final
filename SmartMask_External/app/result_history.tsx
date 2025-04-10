import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useResults } from './ResultsContext';

export default function ResultHistory() {
  const { results, clearResults } = useResults();
  const router = useRouter();
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Results History</Text>

      {[...results].reverse().map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resultCard}
          onPress={() =>
            router.push({
              pathname: '/result_detail',
              params: {
                name: item.name,
                imageUri: item.imageUri,
                timestamp: item.timestamp,
                pH: item.pH,
                healthState: item.healthState,
              },
            })
          }
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp
                ? new Date(item.timestamp).toLocaleString('en-SG', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : 'Unknown time'}
            </Text>
            {/* 🔹 Display pH and health state */}
            <Text style={styles.pH}>pH: {item.pH !== undefined ? item.pH.toFixed(2) : 'N/A'}</Text>
            <Text style={[styles.healthState, getHealthStateStyle(item.healthState)]}>{item.healthState || 'Unknown'}</Text>
            </View>

            <Image source={{ uri: item.imageUri }} style={styles.resultImage} />
            </TouchableOpacity>
            ))}

      <View style={styles.buttons}>
        <Button title="CLEAR HISTORY" onPress={clearResults} />
        <Button title="GO BACK" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

// Define getHealthStateStyle function outside the component
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
    backgroundColor: '#25292e',
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  pH: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  healthState: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  buttons: {
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
});