import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import { projectStorage, projectFirestore, timestamp } from '../firebase/config';
import 'firebase/compat/firestore';

// Define the type for Firestore images
type FirestoreImage = {
  id: string;
  downloadUrl: string; 
  description: string;
};

function ImgurAlbumScreen() {
  const route = useRoute();
  const [images, setImages] = useState<FirestoreImage[]>([]); 
  const [selectedImage, setSelectedImage] = useState<FirestoreImage | null>(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const screenWidth = Dimensions.get('window').width;

  // Shared values for animations
  const opacity = useSharedValue(0); 
  const translateY = useSharedValue(screenWidth); 

  useEffect(() => {
    // Fetch images from Firestore and update the state
    const imagesRef = projectFirestore.collection('images');
    const unsubscribe = imagesRef.onSnapshot((snapshot) => {
      const newImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        downloadUrl: doc.data().downloadUrl, 
        description: doc.data().description,
      }));
      setImages(newImages);
    });
  
    return () => unsubscribe();
  }, []);
  
  // Open the modal and animate it
  const openModal = (image: FirestoreImage) => {
    setSelectedImage(image);
    setNewDescription(image.description); 
    opacity.value = withTiming(1, { duration: 50, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(0, { damping: 6, stiffness: 200 }); 
    setIsModalVisible(true);
  };

  // Close the modal and animate it
  const closeModal = () => {
    opacity.value = withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) });
    translateY.value = withSpring(screenWidth, { damping: 2, stiffness: 150 }); 
    setTimeout(() => {
      setSelectedImage(null);
      setIsModalVisible(false);
      setNewDescription(""); 
    }, 200);
  };

  // Animated styles for modal images
  const modalStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Delete the selected image from Firebase Storage and Firestore
  const deleteImage = async () => {
    if (!selectedImage) return;
    const imageRef = projectStorage.refFromURL(selectedImage.downloadUrl);
    try {
      await imageRef.delete();
      await projectFirestore.collection('images').doc(selectedImage.id).delete();
      closeModal(); 
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  // Save the updated description to Firestore
  const saveDescription = async () => {
    if (!selectedImage || !newDescription) return;
    try {
      await projectFirestore.collection('images').doc(selectedImage.id).update({
        description: newDescription,
      });
      console.log('Description updated successfully');
      closeModal();
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  // The view
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
              source={{ uri: item.downloadUrl }}
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
              <Image style={styles.modalImage} source={{ uri: selectedImage.downloadUrl }} />
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
