import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import Gap from '../../Gap/Gap'

type Props = {
  style?: ViewStyle
  label?: string | React.ReactNode
  labelAlign?: 'left' | 'center' | 'right'
  children: React.ReactNode
  gapBeforeChildren?: boolean
  gapAfterChildren?: boolean
}

const FormField = (props: Props) => {
  const {
    style,
    label,
    labelAlign = 'left',
    children,
    gapBeforeChildren = true,
    gapAfterChildren = true } = props
  return (
    <View style={[styles.container, style]}>
      {label && <View style={styles.labelContainer}>
        {typeof label === "string" ? <Text style={[styles.label, { textAlign: labelAlign }]}>{label}</Text> : label}
      </View>}
      {gapBeforeChildren && <Gap vertical size="xsmall" />}
      {children}
      {gapAfterChildren && <Gap vertical size="xsmall" />}
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
  },
  labelContainer: {
    width: '100%',
  },
  label: {
    // opacity: 0.5,
    marginBottom: 12
  },
})
