import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {Link} from 'expo-router';

// const img = require ("../assets/images/cartoon_mask.png")

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SMARTMASK</Text>

            {/* Add the Image Component */}
            <Image source={require('../assets/images/main_menu.jpg')} style={styles.cartoon_mask}/>
            <Link href="/imagereader" style={styles.button}>
        Click here to Start
      </Link>
            <Image source={require('../assets/images/ntu_logo.png')} style={styles.ntu_logo}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 50,  
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    cartoon_mask: {
        width: 380,
        height: 380,
        resizeMode: 'contain',
        marginTop: 0,
        marginBottom: 20,
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