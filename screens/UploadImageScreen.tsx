import axios from 'axios';
import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
// Define a custom type that includes the 'uri' property
type CustomImagePickerResponse = ImagePickerResponse & {
  uri?: string;
};
function UploadImageScreen() {
  const [selectedImage, setSelectedImage] = useState<CustomImagePickerResponse | null>(null);

  const selectImage = async () => {
    try {
      const response = await launchImageLibrary({ mediaType: 'photo' });

      if (response.didCancel) {
        // The user canceled the image selection
        console.log('Image selection canceled');
      } else if (response.assets && response.assets.length > 0) {
        // Image was selected successfully
        const selectedAsset = response.assets[0];
        setSelectedImage({
          ...selectedAsset,
          uri: selectedAsset.uri || '', // Ensure uri is not undefined
        });
      }
    } catch (error) {
      // Handle any errors that occur during image selection
      console.error('Image selection error:', error);
    }
  }

  const uploadImage = () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image before uploading.');
      return;
    }
    const clientId = '4d89c1a9e541ca2';
    const albumId = 'EhpVAMT';

    const formData = new FormData();

    // Explicitly specify the types for formData and the arguments to append
    formData.append('image', {
      uri: selectedImage.uri,
      name: 'image.jpg', // Set the desired name for the image file
    } as unknown as Blob, 'image.jpg');

    axios
      .post(`https://api.imgur.com/3/upload`, formData, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.data.success) {
          // Image uploaded successfully, you can handle the response here
          Alert.alert('Success', 'Image uploaded to Imgur.');
        } else {
          Alert.alert('Error', 'Failed to upload image to Imgur.');
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image to Imgur.');
      });
  };

  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      )}
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
        <Button title="Upload Image" onPress={uploadImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default UploadImageScreen;
