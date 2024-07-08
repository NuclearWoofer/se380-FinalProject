import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';

function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Image
          source={require('../images/hs1.png')}
          style={styles.image}
        />
        <Text style={styles.title}>About Michael</Text>
        <Text style={styles.text}>
          This application serves as a platform for me to indulge in one of my cherished hobbies: miniature painting. I love playing tabletop games such as Dungeons & Dragons, Warhammer, etc. These games can typically be played with miniature figures representing characters in those games. These miniatures are often purchased unpainted and unassembled. One of my favorite things to do is paint these miniatures!
        </Text>
        <Text>
          Key highlights of this project include:
        </Text>
        <Text></Text>
        <Text>
          - Implementation of Typescript: Leveraging the robustness and type safety offered by Typescript to ensure a more reliable and maintainable codebase.
        </Text>
        <Text>
          - Nested Navigation: Employing nested navigation structures to enhance user experience and streamline app navigation flow.
        </Text>
        <Text>
          - Integration of Expo SDK: Utilizing the powerful capabilities of the Expo SDK, I've seamlessly integrated essential functionalities such as making HTTP requests and incorporating Expo SDK components to enrich the app's features.
        </Text>
        <Text>
          - Dynamic Animation: Enhancing user engagement through dynamic animations, albeit a small amount, however, less is more!
        </Text>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/michael-lopez-a7436b157/')}
          >
            <Text style={styles.linkText}>LinkedIn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('mailto:miketatooine@gmail.com')}
          >
            <Text style={styles.linkText}>Hire Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    marginHorizontal: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default AboutScreen;
