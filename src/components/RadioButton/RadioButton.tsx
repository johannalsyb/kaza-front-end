import React, { CSSProperties } from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import variables from '../../styles/variables'
import Gap from '../Gap/Gap'
import KIcon from '../KIcon/KIcon'
import KText from '../KText'

type RadioButtonProps = {
  checked?: boolean
  name?: string
  onPress?: () => void
  style?: ViewStyle
  disabled?: boolean
}

const RadioButton: React.FC<RadioButtonProps> = ({ checked, name = '', onPress, style, disabled = false }) => (
  <Pressable style={[styles.container, style || {}]} onPress={onPress} disabled={disabled}>
    <View
      style={[
        checked ? styles.RadioButtonActive : styles.RadioButton,
        // {
        //   backgroundColor: checked ? (variables.colors.yellow + (disabled ? "55" : "")) : 'transparent',
        //   borderColor: checked ? variables.colors.yellow : variables.colors.borderGray,
        // }
      ]}>
      {/* {checked && <KIcon name="tick" />} */}
    </View>
    <Gap size="xxsmall" />
    <KText selectable={false} style={{ color: "#000000" + (disabled ? "55" : "") }}>{name}</KText>
  </Pressable>
)

const { borderGray } = variables.colors

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RadioButton: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: borderGray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RadioButtonActive: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 7,
    borderColor: variables.colors.yellow,
    backgroundColor: variables.colors.black,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RadioButton
