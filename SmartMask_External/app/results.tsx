import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { classifyHealthState } from './healthUtils';

const Abnormal = () => (
  <View style={styles.container}>
    <Text style={styles.titlerisk}>Abnormal Result!</Text>
    <Image source={require('../assets/images/at_risk.jpg')} style={styles.cartoon_mask} />
    <Text style={styles.text}>Please visit the nearest doctor as soon as possible!</Text>
  </View>
);

const Healthy = () => (
  <View style={styles.container}>
    <Text style={styles.titlehealthy}>Healthy!</Text>
    <Image source={require('../assets/images/healthy.jpg')} style={styles.cartoon_mask} />
    <Text style={styles.text}>Nothing to worry about!</Text>
  </View>
);

const SlightRisk = () => (
  <View style={styles.container}>
    <Text style={styles.titlecaution}>Slight Risk!</Text>
    <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask} />
    <Text style={styles.text}>Please monitor your health and consider a medical check-up.</Text>
  </View>
);

export default function ResultsScreen() {
  const { pH } = useLocalSearchParams();
  const parsedPH = pH ? parseFloat(pH as string) : null;
  const healthState = classifyHealthState(parsedPH);

  switch (healthState) {
    case 'Abnormal':
      return <Abnormal />;
    case 'Healthy':
      return <Healthy />;
    case 'Slight Risk':
      return <SlightRisk />;
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Unknown health state</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 50,
  },
  titlerisk: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#ff0000',
  },
  titlehealthy: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#00ab41',
  },
  titlecaution: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFDE21',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#000000',
  },
  cartoon_mask: {
    width: 380,
    height: 380,
    resizeMode: 'contain',
  },
});
