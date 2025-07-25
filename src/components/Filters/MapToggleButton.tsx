import React from 'react';
import { Pressable } from 'react-native';
import KIcon from '../KIcon/KIcon';
import variables from '../../styles/variables';

interface MapToggleButtonProps {
  showMap: boolean;
  isMobile: boolean;
  route: any;
  navigation: any;
}

const MapToggleButton: React.FC<MapToggleButtonProps> = ({ showMap, isMobile, route, navigation }) => (
  <Pressable
    style={[{
      borderWidth: 1,
      borderRadius: 50,
      padding: 10,
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 2.5,
      marginRight: 2.5,
      backgroundColor: showMap ? variables.colors.black : 'white',
      borderColor: isMobile ? showMap ? variables.colors.black : 'white' : variables.colors.black,
    }]}
    onPress={() => {
      if (showMap) {
        navigation.navigate(route.name);
      } else {
        navigation.navigate(route.name, { map: true });
      }
    }}
  >
    <KIcon
      name="maps"
      size="large"
      style={showMap ? { color: variables.colors.white } : {}}
    />
  </Pressable>
);

export default MapToggleButton;
