import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { projectStorage, projectFirestore } from '../firebase/config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

function UploadImageScreen() {
  const [imageSource, setImageSource] = useState<string | null>(null);

  // Use the 'useEffect' hook to request permission to access the device's media library
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
      }
    };
    requestPermission();
  }, []);

  // Define a function to select an image from the device's media library using ImagePicker SDK
  const selectImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      // Check if the user selected an image and it's not canceled
      if (!response.canceled && response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        const imageUri = selectedAsset.uri;

        // Set the selected image URI to the state and upload the image
        setImageSource(imageUri);
        uploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  // Define a function to upload the selected image to Firebase Storage and save its URL in Firestore
  const uploadImage = async (imageUri: string) => {
    try {
      // Fetch the image data from the selected URI
      const response = await fetch(imageUri);

      // Check if the fetch was successful
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      // Convert the image data into a blob
      const blob = await response.blob();

      // Generate a unique image ID based on the current timestamp
      const imageId = `${Date.now()}`;

      // Create a reference to the Firebase Storage location to store the image
      const imageRef = projectStorage.ref().child(`images/${imageId}`);

      // Upload the image blob to Firebase Storage
      await imageRef.put(blob);

      // Get the download URL of the uploaded image
      const downloadUrl = await imageRef.getDownloadURL();

      // Save the download URL and a timestamp in Firestore
      await projectFirestore.collection('images').add({
        downloadUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Show a success alert and log the image URL
      Alert.alert('Success', 'Image uploaded successfully');
      console.log('Uploaded Image URL:', downloadUrl);
    } catch (error) {
      // Show an error alert and log the error
      Alert.alert('Error', 'Failed to upload image');
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {imageSource && <Image source={{ uri: imageSource }} style={{ width: 200, height: 200 }} />}
      <Button title="Select Image" onPress={selectImage} />
    </View>
  );
}

export default UploadImageScreen;
