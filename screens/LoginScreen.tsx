import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<ParamListBase, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement authentication logic here
        // For demo purposes, navigate to home screen after login
        navigation.navigate('Gallery'); // Navigate to AlbumScreen
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../images/beanFactory-logos_black.png')}
                style={styles.image}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Text style={styles.footerText}>Paint More Minis!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    footerText: {
        marginTop: 20,
        color: 'blue',
    },
    image: {
        width: 250, // Adjust the width and height as needed
        height: 200,
        marginBottom: 25,
    },
});

export default LoginScreen;
