import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import axios from 'axios';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native'; // Import route hook


type ImgurImage = {
  id: string;
  link: string;
  description: string;
  uploadedImageUrl: string;
};

function ImgurAlbumScreen() {
  const route = useRoute();
  const [images, setImages] = useState<ImgurImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImgurImage | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  // Shared values for animations
  const opacity = useSharedValue(0); // For fade-in animation
  const translateY = useSharedValue(screenWidth); // For slide-up animation

  useEffect(() => {
    const clientId = '4d89c1a9e541ca2';
    const albumId = 'EhpVAMT';

    axios
      .get(`https://api.imgur.com/3/album/${albumId}/images`, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      })
      .then((response) => {
        setImages(
          response.data.data.map((item: any) => ({
            id: item.id,
            link: item.link,
            description: item.description,
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  const openModal = (image: ImgurImage) => {
    setSelectedImage(image);
    // Start animations with faster duration and lower damping ratio
    opacity.value = withTiming(1, { duration: 100, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(0, { damping: 6, stiffness: 200 }); // Adjust stiffness and damping values
    setIsModalVisible(true);
  };

  const closeModal = () => {
    // Start reverse animations with faster duration and lower damping ratio
    opacity.value = withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(screenWidth, { damping: 2, stiffness: 150 }); // Adjust stiffness and damping values
    // After animations complete, reset the modal
    setTimeout(() => {
      setSelectedImage(null);
      setIsModalVisible(false);
    }, 200);
  };

  // Animated styles for modal content
  const modalStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <Image
              style={[
                styles.image,
                {
                  width: screenWidth / 3 - 6,
                  height: screenWidth / 3 - 6,
                },
              ]}
              source={{ uri: item.link }}
            />
            {selectedImage === item && (
              <Text style={styles.imageDescription}>{item.description}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, modalStyles]}>
            {selectedImage && (
              <Image style={styles.modalImage} source={{ uri: selectedImage.link }} />
            )}
            {selectedImage && (
              <Text style={styles.modalDescription}>{selectedImage.description}</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    margin: 3,
    borderRadius: 8,
  },
  imageDescription: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalDescription: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});

export default ImgurAlbumScreen;
