import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ChatScreen = ({
    navigation, route
}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [participantsName, setParticipantsName] = useState([]);

    const [image, setImage] = useState(null);


    const convertImageToBase64 = async (imageUri) => {
        try {
            console.log(imageUri);
            // Optional: Prepend format prefix to display it directly in an <Image /> component
            const fullBase64Data = `${imageUri}`;
            const response = await fetch('http://10.7.1.89:3000/message', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic first:second',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversation_id: route.params.data.conversationId,
                    imageInfo: fullBase64Data ?? 'Hi, from Vaibhav',
                }),
            })

            return fullBase64Data;
        } catch (error) {
            console.error("Error converting image to base64:", error);
            return null;
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        // console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].base64);
        }

        setImage(result.assets[0].uri);

        convertImageToBase64(result.assets[0].base64);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`http://10.7.1.89:3000/message?conversation_id=${route.params.data.conversationId}`, {
            headers: {
                authorization: 'Basic first:second'
            }
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                setMessages(data);
            })
            .catch(err => {
                setLoading(false);
                setError(err);
                console.log(err);
            })


        const promiseAll = route.params.data.participants.map(d => {
            return fetch(`http://10.7.1.89:3000/user/profile?user_id=${d}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic first:second',
                }
            })
                .then(response => response.json())
                .then(t => {
                    return `${t.name}`
                })
        })

        Promise.all(promiseAll)
            .then(d => {
                setParticipantsName(d);
            })
            .catch(e => {
                setError(e);
            })


    }, []);

    function sendMessage() {
        fetch('http://10.7.1.89:3000/message', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic first:second',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversation_id: route.params.data.conversationId,
                content: currentMessage ?? 'Hi, from Vaibhav',
            })
        })
            .then(response => response.json())
            .then(d => {
                setCurrentMessage('');
                console.log(d);
            })
            .catch(e => setError(e));
    }


    return (
        <ScrollView style={{
            flex: 1,
        }}>
            <View style={{
                flex: 1,
                paddingHorizontal: 10
            }}>
                {
                    loading ? <Text>Loading...</Text> : error ? <Text>Error is: {error}</Text> : <View>

                        {messages.data && messages.data.length ? messages.data?.map((data, index) => {

                            const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;

                            // if (index === 3) return <View key={index}></View>

                            const isImage = data.imageInfo;
                            console.log(isImage)

                            return (
                                <TouchableOpacity key={index} onPress={() => {

                                }}>
                                    {
                                        isImage ? <Image source={{
                                            uri: `${isImage}`,
                                        }} height={100} width={100} /> : <Text>

                                        </Text>
                                    }
                                </TouchableOpacity>
                            )
                        }) : <Text>No Messages are there</Text>}

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            flex: 1
                        }}>
                            <TextInput placeholder='Enter your message' style={{
                                borderWidth: 1,
                                borderColor: 'black',
                                paddingVertical: 10,
                                marginVertical: 10,
                                paddingHorizontal: 10,
                                flex: 1,
                                borderRadius: 10
                            }} onChangeText={t => setCurrentMessage(t)} value={currentMessage} />

                            <TouchableOpacity onPress={() => {
                                sendMessage();
                            }} style={{
                                alignItems: 'center'
                            }}>
                                <Text>
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text>
                            Participants: {participantsName && participantsName.map(d => {
                                return `${d},`
                            })}
                        </Text>
                    </View>
                }

                <View>
                    <Button title='Image' onPress={() => {
                        pickImage();
                    }} />

                    {
                        image && <Image source={{
                            uri: image
                        }} height={100} width={100} />
                    }
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default ChatScreen;
