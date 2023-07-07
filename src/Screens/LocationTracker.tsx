import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import Geolocation, { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import User from '../Utility/user';

const LocationTracker: React.FC = () => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const generatedUserId = generateUserId();
    const newUser = new User(generatedUserId, 'John Doe', 0, 0);
    setUser(newUser);

    checkLocationPermission();
  }, []);

  const generateUserId = (): string => {
    return 'user-' + Math.random().toString(36).substring(7);
  };

  const checkLocationPermission = async (): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          startLocationUpdates();
        } else {
          setLocationPermission(false);
        }
      } else if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        const authorized = await Geolocation.checkAuthorization();
        if (authorized === 'authorized') {
          setLocationPermission(true);
          startLocationUpdates();
        } else {
          setLocationPermission(false);
        }
      }
    } catch (error) {
      console.warn('Error checking location permission:', error);
    }
  };

  const startLocationUpdates = (): void => {
    Geolocation.watchPosition(
      (position: GeolocationResponse) => {
        const { latitude, longitude } = position.coords;
        if (user) {
          user.setLocation(latitude, longitude); // Update user's live location
          saveUserData(user); // Save user's updated data to Firestore
        }
      },
      (error: GeolocationError) => {
        console.warn('Error getting location:', error.code, error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 10 },
    );
  };

  const saveUserData = (user: User): void => {
    // Save user data to Firestore
    firestore()
      .collection('users')
      .doc(user.getId())
      .set({
        name: user.getName(),
        latitude: user.getLatitude(),
        longitude: user.getLongitude(),
      })
      .then(() => {
        // Navigate to LiveMap screen
        navigation.navigate('LiveMap');

      })
      .catch((error) => {
        console.warn('Error saving user data:', error);
      });
  };

  const handlePermissionRequest = (): void => {
    checkLocationPermission();
  };

  return (
    <View style={styles.container}>
      {locationPermission ? (
        <Text style={styles.text}>Location permission granted</Text>
      ) : (
        <View>
          <Text style={styles.text}>Location permission not granted</Text>
          <Button title="Request Permission" onPress={handlePermissionRequest} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default LocationTracker;
