import React, { Dispatch, SetStateAction } from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import KIcon from '../../KIcon/KIcon'
import KText from '../../KText'
import Dropdown from './Dropdown'
import variables from '../../../styles/variables'
import { Countries } from '../../../utils/phone'

interface ModalListProps {
  countries: Countries
  code: string
  setCode: (code: string) => void
  countrySearch: string
  error: boolean
  setCountrySearch: Dispatch<SetStateAction<string>>
  isHovered: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
  isOpenDropdown: boolean
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>
  setIsHovered: Dispatch<SetStateAction<number>>
}

const ModalList = (props: ModalListProps) => {
  const {
    countries,
    code,
    setCode,
    countrySearch,
    setCountrySearch,
    isHovered,
    setSelectedIndex,
    setIsOpenDropdown,
    setIsHovered,
    isOpenDropdown
  } = props

  return (
    <Modal visible={isOpenDropdown} animationType="slide">
      <View style={styles.container}>
        <KIcon
          name="backArrow"
          size="large"
          style={styles.iconBack}
          onPress={() => setIsOpenDropdown(false)}
        />
        <KText style={styles.title}>
          Choose your country
        </KText>
      </View>
      <View style={{ paddingHorizontal: 30 }}>
        <Dropdown
          countries={countries}
          code={code}
          setCode={setCode}
          countrySearch={countrySearch}
          error={Boolean(props.error)}
          setCountrySearch={setCountrySearch}
          isHovered={isHovered}
          setSelectedIndex={setSelectedIndex}
          setIsOpenDropdown={setIsOpenDropdown}
          setIsHovered={setIsHovered}
          maxHeight={'calc(100vh - 175px)'}
        />
      </View>
    </Modal>
  )
}

export default ModalList

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  iconBack: {
    backgroundColor: variables.colors.lightCream,
    borderRadius: 50,
    padding: 5
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 62
  }
})