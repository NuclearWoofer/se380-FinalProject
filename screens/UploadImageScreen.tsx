import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
import axios from 'axios'; 

function UploadImageScreen() {
  const [imageSource, setImageSource] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        // Handle permission denied
        console.log('Permission denied');
      }
    };

    requestPermission();
  }, []);

  const selectImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      if (!response.canceled && response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        const imageUri = selectedAsset.uri;
        setImageSource(imageUri);
        uploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
  
  const uploadImage = async (imageUri: string) => {
    const clientId = '4d89c1a9e541ca2'; 
    const albumId = 'EhpVAMT'; 

    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();

      // Extract the file extension from the imageUri
      const fileExtension = imageUri.split('.').pop() || 'jpg'; // Default to 'jpg' if extension is missing

      const formData = new FormData();
      // Append the image with the desired file extension
      formData.append('image', blob, `image.${fileExtension}`);
      formData.append('album', albumId);

      // Log the formData before making the Axios request
      console.log('FormData:', formData);

      const uploadResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.status === 200) {
        Alert.alert('Success', 'Image uploaded successfully');
        console.log('Uploaded Image URL:', uploadResponse.data.data.link); // This is the uploaded image URL
      } else {
        Alert.alert('Error', 'Failed to upload image');
        console.error('Upload Error:', uploadResponse.data);
      }
    } catch (error) {
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
