import { Alert } from "react-native";
import { MAP_API_KEY } from "./constants";

export const fetchHotels = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=lodging&keyword=hotel&key=${MAP_API_KEY}`
      );
      const data = await response.json();
      console.log("Response from Google Places API:", data);
      if (data.status === 'OK') {
        return data
      } else {
        console.error('Error fetching hotels:', data.status);
        Alert.alert('Error', 'Failed to fetch hotels. Please try again later.');
        return false
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      Alert.alert('Error', 'Failed to fetch hotels. Please check your network connection.');
      return false
    }
};

