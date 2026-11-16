import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
    const [imageUri, setImageUri] = useState(null);


    /**
        steps to get the camera
        1. Get Permission from the OS to use the Native camera UI
        2. Launch Camera
        3. get the image location

        This should be used when our use case is to get the images from the camera
     */


    const takePhotoWithCamera = async () => {
        // Request camera permissions
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Permission Denied',
                'You need to grant camera access to use this feature.'
            );
            return;
        }

        // Launch the camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images', // currently only supporting images to be captured from native camera UI
            allowsEditing: true,
            aspect: [4, 3],
            allowsMultipleSelection: false,
            quality: 1,
        });

        // Check if the user took a picture
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Take Photo with Camera" onPress={takePhotoWithCamera} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: 250,
        height: 250,
        marginTop: 16,
        borderRadius: 8,
    },
});