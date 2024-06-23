import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert, Linking, TextInput, Button as RNButton, TouchableOpacity, Pressable } from 'react-native';
import { Avatar, Card, Text, Appbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import { MAP_API_KEY } from '../utils/constants';
import { fetchHotels } from '../utils/api';
import { getUserLocation } from '../utils/helper';
import ContainerWrapper from './ContainerWrapper';



const LeftContent = props => <Avatar.Icon {...props} icon="map" />;

const ListScreen = () => {

  const navigation = useNavigation();
  
  //states
  const [refreshing, setRefreshing] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [theme, setTheme] = useState("light");
  const [likedItemsID, setLikedItemsID] = useState([])
  const [showLikedOnly, setShowLikedOnly] = useState(false)


  // Fetch initial data and setup
  useEffect(() => {
    fetchHotelsHandler();
    getTheme();
    getLikedItemsFromAsync();
  }, []);

  // Fetch hotels based on user's location
  const fetchHotelsHandler = async() => {

    getUserLocation(async(position)=>{
        
      const { latitude, longitude } = position;
      const data = await fetchHotels(latitude, longitude);
      if(data){
        const filteredHotels = data.results.filter(result => result.types.includes('lodging') || result.types.includes('hotel'));
        setHotels(filteredHotels);
      }

    }, (error)=>{
      console.log(error)
    });
  };


//Get theme from AsyncStorage
  const getTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('theme');
      if (value !== null) {
        setTheme(value);
      }
    } catch (e) {
      console.error('Error reading theme from AsyncStorage:', e);
    }
  };

  //reloading the hotels on refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchHotelsHandler();
    setRefreshing(false);
  };

  //get liked items from asyncstorage
  const getLikedItemsFromAsync = async ()=>{
    const likedItemsFromAsync = await AsyncStorage.getItem('likedItems');
    if(likedItemsFromAsync){
      setLikedItemsID(JSON.parse(likedItemsFromAsync))
    }

  }

  //toggle like
  const likeHandler = async(item)=>{
    let data = [...likedItemsID]
    if(likedItemsID.includes(item.place_id)){
      data = likedItemsID.filter(likedItem => likedItem !== item.place_id)
    }else{
      data = [...likedItemsID, item?.place_id]
      
    }
    AsyncStorage.setItem("likedItems", JSON.stringify(data))
    setLikedItemsID(data)
  }

  //go to specific hotels with marker
  const navigateToSpecificItem = (item)=>{
    navigation.navigate("SingleMapScreen",{item})
  }

  //show liked hotels only
  const hotelsFilter = useMemo(() => {
    if(showLikedOnly){
      return hotels.filter(hotel => likedItemsID.includes(hotel.place_id) )
    }else{
      return hotels
    }
    
  }, [showLikedOnly, hotels, likedItemsID])
  

  return (
    <ContainerWrapper>
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#000000' }}>
          <Appbar.Content title="Hotels Near You" />
          <Pressable onPress={()=>{setShowLikedOnly(!showLikedOnly)}} >
            <Text style={{textDecorationLine: 'underline', color: showLikedOnly?"red": "black" }} >Liked</Text>
          </Pressable>
        </Appbar.Header>
        
        <FlatList
          // style={{paddingTop: 20}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={hotelsFilter}
          renderItem={({ item }) => (
            <Card style={{marginHorizontal: 10, marginBottom: 10 ,backgroundColor: theme === 'light' ? '#FFFFFF' : '#000000' }}>
              <Card.Title
                title={<Text style={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }}>{item.name}</Text>}
                subtitle={<Text style={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }}>{item.vicinity}</Text>}
                left={LeftContent}
              />
              <Card.Cover source={{ uri: item.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${MAP_API_KEY}` : 'https://via.placeholder.com/150' }} />
              <Card.Actions>
                  
                  <TouchableOpacity style={{borderWidth: 1, borderRadius: 100, paddingHorizontal: 20, height: 35, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                    navigateToSpecificItem(item)
                    // navigation.navigate('Marker', { lat: item.geometry.location.lat, long: item.geometry.location.lng, desc: item.name, address: item.vicinity })
                  }}>
                    <Feather name="map-pin" size={22} color="blue" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={{borderWidth: 1,borderColor: "#5E02E7", backgroundColor: "#5E02E7", borderRadius: 100, paddingHorizontal: 20, height: 35, alignItems: 'center', justifyContent: 'center'}} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.geometry.location.lat},${item.geometry.location.lng}`)}>
                    <Entypo name="direction" size={22} color="#422040" />
                  </TouchableOpacity>

                  <TouchableOpacity style={{borderWidth: 1, borderRadius: 100,paddingHorizontal: 20, height: 35, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{likeHandler(item)}}>
                    <Entypo name="heart" size={22} color = {likedItemsID.includes(item.place_id)?"red" :"gray"} />
                  </TouchableOpacity>
              </Card.Actions>
            </Card>
          )}
          keyExtractor={item => item.place_id}
        />
      </View>
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,

  },
});

export default ListScreen;