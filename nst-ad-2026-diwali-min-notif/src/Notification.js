import { useState, useEffect } from 'react';
import { Text, View, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

async function requestPermissionAndGetToken() {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  return messaging().getToken();
}

export default function NotificationWrapper() {
  const [fcmToken, setFcmToken] = useState('fetching…');
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    requestPermissionAndGetToken()
      .then(setFcmToken)
      .catch((e) => setFcmToken(String(e)));

    // Foreground message handler
    const unsub = messaging().onMessage(async (msg) => setNotif(msg));
    return unsub;
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text selectable style={{ fontWeight: 'bold', marginBottom: 8 }}>FCM Token:</Text>
      <Text selectable style={{ fontSize: 11, textAlign: 'center', marginBottom: 24 }}>{fcmToken}</Text>

      {notif && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Last notification:</Text>
          <Text>Title: {notif.notification?.title}</Text>
          <Text>Body: {notif.notification?.body}</Text>
          <Text>Data: {JSON.stringify(notif.data)}</Text>
        </View>
      )}
    </View>
  );
}
