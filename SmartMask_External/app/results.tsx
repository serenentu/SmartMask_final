import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { classifyHealthState, getHealthMessage } from './healthUtils';

export default function ResultsScreen() {
    const [pH, setPH] = useState(7.5);

    // Determine the state based on pH value
    const healthState = classifyHealthState(pH);
    const healthMessage = getHealthMessage(healthState);

    return renderHealthState(healthState, healthMessage);
}

// 🔹 Function to Render UI Based on Health State
const renderHealthState = (healthState, healthMessage) => {
    switch (healthState) {
        case "Abnormal":
            return <Abnormal healthMessage={healthMessage} />;
        case "Healthy":
            return <Healthy healthMessage={healthMessage} />;
        case "Slight Risk":
            return <SlightRisk healthMessage={healthMessage} />;
    }
};

const Abnormal = ({ healthMessage }) => (
    <View style={styles.container}>
        <Text style={styles.titlerisk}>Abnormal Result!</Text>
        <Image source={require('../assets/images/at_risk.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>{healthMessage}</Text>
    </View>
);

const Healthy = ({ healthMessage }) => (
    <View style={styles.container}>
        <Text style={styles.titlehealthy}>Healthy!</Text>
        <Image source={require('../assets/images/healthy.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>{healthMessage}</Text>
    </View>
);

const SlightRisk = ({ healthMessage }) => (
    <View style={styles.container}>
        <Text style={styles.titlecaution}>Slight Risk!</Text>
        <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>{healthMessage}</Text>
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
        backgroundColor: '#d3d3d3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0056b3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    }
});
