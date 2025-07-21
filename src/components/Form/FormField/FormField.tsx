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
    marginBottom: 25
  },
  labelContainer: {
    width: '100%',
    marginBottom: 15
  },
  label: {
    color: '#000',
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 13,
    letterSpacing: -0.5
  },
})
