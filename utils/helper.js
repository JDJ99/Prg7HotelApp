import Geolocation from "@react-native-community/geolocation";
import { Alert, PermissionsAndroid, Platform } from "react-native";

Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
    enableBackgroundLocationUpdates: true,
    locationProvider: "auto"
})

export const getUserLocation = async (
    onSuccess,
    onError
) => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                onSuccess({ latitude, longitude });
            },
            (error) => {
                onError({ denied: true, error });
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    } else {
        onError({ denied: true });
    }
};

// export const getUserLocation = async ()=>{
//     const hasPermission = await requestLocationPermission()
//     if(hasPermission){
//         return Geolocation.getCurrentPosition(
//             async position => {
//             //   const { latitude, longitude } = position.coords;
//               return position
//             },
//             error => {
//               console.error('Error getting location:', error);
//               Alert.alert('Error', 'Failed to get current location. Please enable location services.');
//               return false
//             },
//             { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//           );
//     }
//     return false
// }

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Error requesting location permission:', error);
            return false;
        }
    } else {
        return true; // iOS handles permissions via Info.plist, so always return true
    }
};