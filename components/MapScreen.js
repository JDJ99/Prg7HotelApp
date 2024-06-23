import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import { useTheme } from './Theme';
import LocationHandler from './LocationHandler';

import Geolocation from '@react-native-community/geolocation';
import { MAP_API_KEY } from '../utils/constants';
import { getUserLocation } from '../utils/helper';
import { fetchHotels } from '../utils/api';
import ContainerWrapper from './ContainerWrapper';


const MapScreen = ({ navigation, route }) => {

  
  const markerRef = useRef(null)
  const mapRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(null);
  const { isDarkTheme, colors } = useTheme();
  const [hotels, setHotels] = useState([]);
  const hasItem = route?.params?.item || false
  
  //fetch hotels and update location when hasItem.place_id changes
  useEffect(() => {
    fetchHotelsHandler()
  }, [hasItem?.place_id]);


  const  onLocationUpdate = (location)=>{
    if(location){
        // setCurrentLocation(location)
        // console.log(location)
    }
  }

  //fetch hoteels based on user's location
  const fetchHotelsHandler = async() => {

    getUserLocation(async(position)=>{
        
      const { latitude, longitude } = position;
      setCurrentLocation({
        latitude,
        longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
        

      })
      if(!hasItem){
        const data = await fetchHotels(latitude, longitude);
        if(data){
          const filteredHotels = data.results.filter(result => result.types.includes('lodging') || result.types.includes('hotel'));
          setHotels(filteredHotels); //update hotel state with fetched data
        }
      }
      //fit map to marker
      setTimeout(() => {
        mapRef.current?.fitToElements({
          animated: true,
          edgePadding: {
            bottom: 50,
            left: 50,
            right: 50,
            top: 50,
          },
        });
      }, 500);
    }, (error)=>{
      console.log(error)
    });
  };

  


  return (
    
    <ContainerWrapper>
      <LocationHandler onLocationUpdate={onLocationUpdate} /> 
      {currentLocation?.latitude ? (
        <>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={PROVIDER_GOOGLE}
            region={currentLocation}
          >
            
            <Marker coordinate={currentLocation} title='My Location' pinColor='green'  />
            {
              !!hasItem && (
                <Marker
                  ref={markerRef}
                  coordinate={{
                    latitude: hasItem.geometry.location.lat,
                    longitude: hasItem.geometry.location.lng,
                  }}
                  title={hasItem?.name}
                />

              )
            }
            
            {hotels.map((hotel, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: hotel.geometry.location.lat,
                  longitude: hotel.geometry.location.lng,
                }}
                title={hotel.name}
              />
            ))}
          </MapView>
        </>
      ) : (
        <View style={styles.loading}>
          <Text>Loading...</Text> 
        </View>
      )}
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default MapScreen;
