import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';


const AllUsers = ({
    navigation
}) => {
    const [users, setUsers] = useState([]);
    const [err, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [type, setType] = useState('');

    const [convoName, setConvoName] = useState('');

    useEffect(() => {
        setLoading(true);
        fetch('http://10.7.1.89:3000/user', {
            headers: {
                authorization: 'Basic first:second'
            }
        })
            .then(data => data.json())
            .then(data => {
                setUsers(data);
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                setError(err);
            })
    }, []);

    function startNewConversation() {
        return fetch('http://10.7.1.51:3000/conversation', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic first:second',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                name: convoName ?? 'Said And Done',
                participants_ids: selectedUsers
            })
        })
            .then(response => response.json())
            .then(data => {
                // let the user know if the conversation between the two already exit, can be done using time comparision
                setConvoName('');
                setType('');
                setSelectedUsers([]);
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            })
    }


    return (
        <ScrollView showsVerticalScrollIndicator alwaysBounceVertical={false}>
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading</Text></View> : err ? <Text>Error is: {err}</Text> : <View style={{
                flex: 1
            }}>
                <TouchableOpacity onPress={() => {
                    startNewConversation()
                        .then(() => console.log('created'));
                }} style={{
                    backgroundColor: 'blue',
                    alignItems: 'center',
                    paddingVertical: 10
                }}>
                    <Text>
                        Start new conversation
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setType('DM');
                }} style={{
                    backgroundColor: 'green',
                    alignItems: 'center',
                    paddingVertical: 10,
                    marginVertical: 10
                }}>
                    <Text>
                        DM
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setType('GROUP');
                }} style={{
                    backgroundColor: 'orange',
                    alignItems: 'center',
                    paddingVertical: 10
                }}>
                    <Text>
                        GROUP
                    </Text>
                </TouchableOpacity>
                <View style={{
                    marginVertical: 10
                }}>
                    <TextInput style={{
                        borderColor: 'black',
                        borderWidth: 1,
                        paddingVertical: 10,
                    }} placeholder='Enter your convoName' value={convoName} onChangeText={t => setConvoName(t)} />
                </View>
                <TouchableOpacity onPress={() => {
                    setType('');
                    setSelectedUsers([]);
                    setConvoName('');
                }} style={{
                    backgroundColor: 'orange',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}>
                    <Text>
                        RESET
                    </Text>
                </TouchableOpacity>
                {
                    users.map((data) => {
                        return (
                            <View key={data.id}>
                                <TouchableOpacity onPress={() => {
                                    setSelectedUsers(prev => [...prev, data.id])
                                }}>
                                    <Text>
                                        {data.name}
                                    </Text>

                                    <Text>
                                        {data.bio}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
            }
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AllUsers;
