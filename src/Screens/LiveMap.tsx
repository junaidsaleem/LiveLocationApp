import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import User from '../Utility/user';

const LiveMap: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          return new User(doc.id, data.name, data.latitude, data.longitude);
        });
        setOnlineUsers(users);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
        {onlineUsers.map((user) => (
          <Marker
            key={user.getId()}
            coordinate={{ latitude: user.getLatitude(), longitude: user.getLongitude() }}
            title={user.getName()}
            description="Online User"
          />
        ))}
      </MapView>
      {onlineUsers.length === 0 && <Text style={styles.text}>No online users</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default LiveMap;
