import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

const ConversationScreen = ({ navigation, route }) => {
    const [conversation, setConversation] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [convoCreatedBy, setConvoCreatedBy] = useState('');

    useEffect(() => {
        setLoading(true)
        fetch('http://10.7.1.51:3000/conversation', {
            method: 'GET',
            headers: {
                authorization: 'Basic first:second'
            }
        })
            .then(response => response.json())
            .then(data => {
                const promiseAll = data.map(d => { 
                    return fetch(`http://10.7.1.51:3000/user/profile?user_id=${d.createdBy}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Basic first:second',
                        }
                    })
                        .then(response => response.json())
                        .then(t => { 
                            return `Created By: ${t.name}`
                        })
                })

                Promise.all(promiseAll)
                    .then((d) => { 
                        d.map((t, index) => { 
                            data[index] = {
                                ...data[index],
                                createdBy: t
                            }
                        })
                        setConversation(data);
                        setLoading(false);
                    })
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            })
    }, []);

    return (
        <ScrollView>
            <View style={{
                flex: 1,
            }}>
                {
                    loading ? <Text>Loading...</Text> : error ? <Text>Error is: {error}</Text> : <View>
                        {conversation.map((data, index) => {
                            return (
                                <View key={index} style={{
                                    marginVertical: 10,
                                    gap: 5,
                                    backgroundColor: 'gray',
                                    paddingVertical: 10
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('Chat', {
                                            data: {
                                                name: data.name,
                                                conversationId: data.id,
                                                participants: data.participants_ids
                                            }
                                        })
                                    }}>
                                        <Text>NAME: {data.name ?? 'Unknown'}</Text>
                                        <Text>
                                            {data.createdBy}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                        </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ConversationScreen;
