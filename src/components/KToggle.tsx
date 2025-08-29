import React from 'react';
import { Switch, View, ViewStyle } from 'react-native';
import variables from '../styles/variables';

interface KToggleProps {
  isOn: boolean;
  onToggle?: (isOn: boolean) => void;
  style?: ViewStyle;
}

const KToggle: React.FC<KToggleProps> = ({ isOn, onToggle, style }) => {
  return (
    <View style={[{ width: 40, height: 20 }, style]}>
      <Switch
        trackColor={{ false: '#e7c711ff', true: variables.colors.black }}
        thumbColor="#e7c711ff"
        ios_backgroundColor="#e7c711ff"
        onValueChange={onToggle || (() => {})}
        value={isOn}
        disabled={!onToggle}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 1 }]}}
      />
    </View>
  );
};

export default KToggle;