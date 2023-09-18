import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import axios from 'axios';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the trash can icon
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon

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
  const [newDescription, setNewDescription] = useState<string>("");
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
    setNewDescription(image.description); // Initialize the description input with the current description
    opacity.value = withTiming(1, { duration: 50, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(0, { damping: 6, stiffness: 200 }); // Adjust stiffness and damping values
    setIsModalVisible(true);
  };

  const closeModal = () => {
    opacity.value = withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(screenWidth, { damping: 2, stiffness: 150 }); // Adjust stiffness and damping values
    // After animations complete, reset the modal
    setTimeout(() => {
      setSelectedImage(null);
      setIsModalVisible(false);
      setNewDescription(""); // Clear the description input
    }, 200);
  };

  // Animated styles for modal content
  const modalStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const deleteImage = async () => {
    if (!selectedImage) return;

    const clientId = '4d89c1a9e541ca2';
    const imageId = selectedImage.id;

    try {
      const response = await axios.delete(`https://api.imgur.com/3/image/${imageId}
      `, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      });

      if (response.status === 200) {
        // Image deleted successfully, you can update your local state or perform any necessary actions
        console.log('Image deleted successfully');
        closeModal(); // Close the modal after deletion
      } else {
        console.error('Failed to delete image:', response.data);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const saveDescription = async () => {
    if (!selectedImage || !newDescription) return;

    const clientId = '4d89c1a9e541ca2';
    const imageId = selectedImage.id;

    try {
      const response = await axios.post(
        `https://api.imgur.com/3/image/${imageId}`,
        {
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Client-ID ${clientId}`,
          },
        }
      );

      if (response.status === 200) {
        // Description updated successfully, you can update your local state or perform any necessary actions
        console.log('Description updated successfully');
        closeModal(); // Close the modal after updating
      } else {
        console.error('Failed to update description:', response.data);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

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
              <TextInput
                style={styles.descriptionInput}
                placeholder="New Description"
                value={newDescription}
                onChangeText={(text) => setNewDescription(text)}
              />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={saveDescription}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

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
  descriptionInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
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
  deleteButton: {
    flex: 1,
    marginLeft: 10, // Add margin to separate buttons
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default ImgurAlbumScreen;
