import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {Link} from 'expo-router';

// const img = require ("../assets/images/cartoon_mask.png")

export const classifyHealthState = (pH) => {
    if (pH === null) return "Unknown";
    if (pH <= 6.5 || pH > 8.3) return "Abnormal";
    if (pH === 7.5) return "Healthy";
    if (pH > 6.5 && pH <= 7.7) return "Slight Risk";
    return "Unknown";
};

export default function ResultsScreen() {
    const [pH, setPH] = useState(7.5);

    // Determine the state based on pH value
    const healthState = classifyHealthState(pH);

    return renderHealthState(healthState);
}
 // 🔹 Function to Render UI Based on Health State
const renderHealthState = (healthState) => {
    switch (healthState) {
        case "Abnormal":
            return <Abnormal />;
        case "Healthy":
            return <Healthy />;
        case "Slight Risk":
            return <SlightRisk />;
    }
};

const Abnormal = () => (
    <View style={styles.container}>
        <Text style={styles.titlerisk}>Abnormal Result!</Text>
        <Image source={require('../assets/images/at_risk.jpg')} style={styles.cartoon_mask}/>
        <Text style={styles.text}>Please visit the nearest doctor as soon as possible!</Text>
    </View>
);

const Healthy = () => (
    <View style={styles.container}>
        <Text style={styles.titlehealthy}>Healthy!</Text>
        <Image source={require('../assets/images/healthy.jpg')} style={styles.cartoon_mask}/>
        <Text style={styles.text}>Nothing to worry about!</Text>
    </View>
);

const SlightRisk = () => (
    <View style={styles.container}>
        <Text style={styles.titlecaution}>Slight Risk!</Text>
        <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask}/>
        <Text style={styles.text}>Please monitor your health and consider a medical check-up.</Text>
    </View>
);


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
        justifyContent: 'center',
        color: '#000000',
    },

    cartoon_mask: {
        width: 380,
        height: 380,
        resizeMode: 'contain',
        marginTop: 0,
    },
    ntu_logo: {
        width: 220,
        height: 140,
        marginTop: 0,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#d3d3d3', // 🔹 Fill color (Change this to your preferred color)
        paddingVertical: 12, // 🔹 Space inside the button (height)
        paddingHorizontal: 20, // 🔹 Space inside the button (width)
        borderRadius: 10, // 🔹 Rounded corners
        borderWidth: 2, // 🔹 Border thickness
        borderColor: '#0056b3', // 🔹 Border color
        alignItems: 'center', // 🔹 Centers text inside the button
        justifyContent: 'center',
        marginBottom: 50, // 🔹 Space below the button
    }
    
    });