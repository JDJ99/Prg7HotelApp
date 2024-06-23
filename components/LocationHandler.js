import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


const LocationHandler = ({ onLocationUpdate }) => {
  useEffect(() => {
    //request location permission
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show your position on the map.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const startWatchingPosition = () => {
      Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationUpdate({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, //location update after x meters
          interval: 5000, //time between updates in milliseconds
          fastestInterval: 2000, //fastest rate app handles update in milliseconds
        }
      );
    };

    requestLocationPermission().then(startWatchingPosition);

    return () => {
      Geolocation.clearWatch();
    };
  }, [onLocationUpdate]);

  return null;
};

export default LocationHandler;
