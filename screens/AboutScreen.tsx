import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/hs1.png')}
        style={styles.image}
      />
      <Text style={styles.title}>About Michael</Text>
      <Text style={styles.text}>
        This is my final project for SE380 React Native. The goal of this project is to create an application that uses everything we have learned from the course this quarter. This project must include Typescript, Nested Navigation, Must make an HTTP request AND use one item from the Expo SDKLinks to an external site. OR use two items from the Expo SDK.Links to an external site, and finally an Animation.
      </Text>
      <Text style={styles.text}>
        This app is a place where I also get to share one of my favorite hobbies: miniature painting. I love collecting tabletop games such as Dungeons & Dragons, Warhammer, etc. These games can typically be played with miniature figures representing characters in those games. These miniatures are often purchased unpainted and disassembled. One of my favorite things to do is paint these miniatures!
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
          <Text style={styles.linkText}>Email Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
