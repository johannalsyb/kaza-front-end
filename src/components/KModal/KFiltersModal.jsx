import React from 'react'
import {
  Modal,
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import variables from '../../styles/variables'

const FiltersModal = ({ visible, onClose, filterView, clearButton }) => {
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={onClose}
      />

      <View
        style={[
          styles.container,
          Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 8, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            },
            android: {
              elevation: 8,
            },
            web: {
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.3)',
            },
          }),
        ]}
      >
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: variables.colors.black, opacity: 0.5, fontSize: 16, fontFamily: variables.font.family.regular }}>Filters</Text>
          {clearButton}
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 2 }}>
          {filterView}
        </View>
      </View>
      <View style={styles.beak} />
    </Modal>
  )
}

export default FiltersModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 152,
    right: 10,
    paddingTop: 18,
    paddingLeft: 14,
    paddingRight: 30,
    paddingBottom: 30,
    borderRadius: 15,
    backgroundColor: variables.colors.white,
    gap: 10,
    zIndex: 10,
  },
  beak: {
    position: 'absolute',
    top: 147,
    right: 90,
    width: 12,
    height: 12,
    backgroundColor: variables.colors.white,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    zIndex: 11,
  }
  
})
