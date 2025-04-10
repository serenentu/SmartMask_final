import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function ImageViewer({ imgSource, selectedImage }) {
  return (
    <View style={styles.imageContainer}>
      <Image 
        source={selectedImage ? { uri: selectedImage } : imgSource} 
        style={styles.image} 
         resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,  
  },
  image: {
    width: 400, 
    height: 400, 
    borderRadius: 30,
  },
});

