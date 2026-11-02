import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const ChatScreen = ({
    navigation, route
}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [participantsName, setParticipantsName] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch(`http://10.7.1.51:3000/message?conversation_id=${route.params.data.conversationId}`, {
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
            return fetch(`http://10.7.1.51:3000/user/profile?user_id=${d}`, {
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
        fetch('http://10.7.1.51:3000/message', {
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
                            return (
                                <TouchableOpacity key={index} onPress={() => {

                                }}>
                                    <Text>
                                        {data.content}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }) : <Text>No Messages are there</Text>}

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            flex: 1}}>
                            <TextInput placeholder='Enter your message' style={{
                                borderWidth: 1,
                                borderColor: 'black',
                                paddingVertical: 10,
                                marginVertical: 10,
                                paddingHorizontal: 10,
                                flex: 1,
                                borderRadius: 10
                            }} onChangeText={t => setCurrentMessage(t)} value={currentMessage}/>
                            
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default ChatScreen;
