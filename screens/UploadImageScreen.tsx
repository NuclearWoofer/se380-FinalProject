import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

function UploadImageScreen() {
  const [imageSource, setImageSource] = useState<string | null>(null);

  const selectImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          const firstAsset = response.assets[0];
          if (firstAsset.uri) {
            setImageSource(firstAsset.uri);
            uploadImage(firstAsset.uri);
          } else {
            Alert.alert('Error', 'Selected image URI is undefined');
          }
        }
      }
    );
  };

  const uriToBlob = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to convert URI to Blob');
    }
  };

  const uploadImage = async (imageUri: string) => {
    const clientId = '4d89c1a9e541ca2';
    const auth = 'Client-ID ' + clientId;

    try {
      const blob = await uriToBlob(imageUri);

      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');

      const response = await fetch('https://api.imgur.com/3/image/', {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Image uploaded successfully');
        console.log(responseData);
      } else {
        Alert.alert('Error', 'Failed to upload image');
        console.error(responseData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      console.error(error);
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
