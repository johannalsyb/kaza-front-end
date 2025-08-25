import { View } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { NavStackParamList } from '../navigation/screens';
import KText from '../components/KText';
import Properties from '../api/properties';
import KIcon from '../components/KIcon/KIcon';
import useIsMobile from '../hooks/useIsMobile';
import KButton from '../components/KButton/KButton';
import { Property } from '../common/types/api/properties';
import useAuthentication from '../hooks/useAuthentication';
import PropertyList from '../components/Views/Properties/PropertyList';

type Props = NativeStackScreenProps<NavStackParamList, 'Properties'>;

export default ({ route, navigation }: Props) => {
  const { user } = useAuthentication()
  const [properties, setProperties] = useState<Property[]>();
  const { isMobile } = useIsMobile();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setProperties([]);
        return;
      }
      setLoading(true);
      Properties.favourites.get()
        .then(res => {
          if (!res.data) return;
          setProperties(res.data);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    }, [user])
  );

  if (!properties) return null
  
  return (
  <PropertyList
    loading={loading}
    properties={properties}
    navigation={navigation}
    showSearchBar={false}
    onSearch={() => { }}
    onShowMore={null}
    emptyListView={
      <View style={{
        flex: 1,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        padding: 110,
      }}>
        <KIcon name="fav" size="xxlarge" style={{
          stroke: "black",
          backgroundColor: "white",
          borderRadius: 100,
          padding: 10,
        }} />
        <KText style={{ fontSize: isMobile ? 18 : 25, fontWeight: "bold", marginTop: 10, marginBottom: 20, textAlign: "center" }}>
          {user ? "Haven't found any favourites yet" : "Please login to see your favourites"}
        </KText>
        {user ?
          <>
            {/* <KText style={{ maxWidth: isMobile ? "90%" : "25%", textAlign: "center", lineHeight: 20 }}>
              No worries! Explore our content, discover your favorites, and start building a personalized collection that speaks to you.
            </KText> */}
            <KButton text="Explore" color="primary" onPress={() => {
              navigation.navigate('Home')
            }} style={{ marginTop: 10 }} />
          </>
          : <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "30%",
            marginTop: 20,
          }}>
            <KButton
              text="Sign in"
              color="light"
              onPress={() => {
                navigation.navigate('Login')
              }}
            />
            <KButton
              text="Register"
              color="primary"
              onPress={() => {
                navigation.navigate('SignUp')
              }} />
          </View>}
      </View>
    } />
  );
};
