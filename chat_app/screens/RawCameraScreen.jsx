import { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// We can only open 1 CameraView at single point of time, => always unmount your Camera Preview, How to do this is HW for you

export default function RawCameraScreen() {
    /**
        Just give us the camera view and we can add our own custom style to it
        By default we have the default styling attached to the view
     */
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState(null);
    const cameraRef = useRef(null); // this is something new and belongs to react concept, assume this variable connects with the camera

    // 1. Handle permission loading state, takes time to get the permission, under the hood useCameraPermissions hook does it task
    if (!permission) {
        return <View />;
    }

    // 2. Request permission if not granted
    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>Camera access is required to take photos.</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // 3. Capture the image using the camera ref
    const takePicture = async () => {
        const camera = cameraRef.current;
        if (camera) {
            const photo = await camera.takePictureAsync({
                quality: 0.8,
            });
            if (photo) {
                setPhotoUri(photo.uri);
            }
        }
    };

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    // 4. Show captured photo preview with a retake option
    if (photoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <View style={styles.controls}>
                    <Button title="Retake" onPress={() => setPhotoUri(null)} />
                </View>
            </View>
        );
    }

    // 5. Render live camera view with custom overlay controls
    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shutterButton} onPress={takePicture} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    message: { textAlign: 'center', marginBottom: 12 },
    camera: { flex: 1 },
    preview: { flex: 1, resizeMode: 'contain' },
    controls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
    },
    text: { color: '#fff', fontWeight: 'bold' },
    shutterButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#ccc',
    },
});
