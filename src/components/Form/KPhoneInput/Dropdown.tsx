import React, { Dispatch, SetStateAction } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import variables from '../../../styles/variables'
import KIcon from '../../KIcon/KIcon'
import KText from '../../KText'
import { Countries } from '../../../utils/phone'
import useIsMobile from '../../../hooks/useIsMobile'

interface DropdownProps {
  countries: Countries
  code: string
  setCode: (code: string) => void
  countrySearch: string
  error: boolean
  setCountrySearch: Dispatch<SetStateAction<string>>
  isHovered: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>
  setIsHovered: Dispatch<SetStateAction<number>>
  maxHeight?: string | number
}

const Dropdown = (props: DropdownProps) => {
  const {
    countries,
    code,
    setCode,
    countrySearch,
    error,
    setCountrySearch,
    isHovered,
    setSelectedIndex,
    setIsOpenDropdown,
    setIsHovered,
    maxHeight = 300
  } = props
  const { isMobile } = useIsMobile()
  return (
    <>
      <View style={[styles.searchContainer, { marginBottom: isMobile ? 30 : 0 }]}>
        <KIcon name="search" size="medium" style={{ marginRight: 10 }} />
        <TextInput
          value={countrySearch}
          onChangeText={(e) => setCountrySearch(e)}
          placeholder='Enter country name or code'

          style={[styles.textInput,
          Platform.OS === 'web' ? styles.webInput : {},
          !!error ? styles.formError : {},
          ]} />
      </View>
      <ScrollView style={{ maxHeight: maxHeight as any }}>
        {Object.entries(countries).map(([c, countries], index) => (
          <Pressable
            key={'drop-down-item-' + index}
            style={[styles.dropdownItem, {
              backgroundColor:
                isHovered !== index && code === c ? variables.colors.xLightGray : isHovered === index
                  ? variables.colors.yellow
                  : 'transparent',
            }]}
            onPress={() => {
              setCode(c)
              setSelectedIndex(index)
              setIsOpenDropdown(false)
            }}
            onHoverIn={() => setIsHovered(index)}
            onHoverOut={() => setIsHovered(-1)}>
            <KText>
              {countries.join(", ")}
              <KText style={{ opacity: 0.5 }}> {c}</KText>
            </KText>
          </Pressable>

        ))}
      </ScrollView>
    </>
  )
}

export default Dropdown

const styles = StyleSheet.create({
  formError: {
    borderColor: variables.colors.xLightGray,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: variables.colors.white,
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: variables.colors.xLightGray,
    borderRadius: 23,
    height: 43,
  },
  textInput: {
    color: variables.colors.black,
    opacity: 0.6,
    fontSize: 16,
    height: 44,
    textAlign: 'left',
    paddingVertical: 0,
    width: '100%',
  },
  webInput: {
    //@ts-ignore
    outlineWidth: 0,
  },
  dropdownItem: {
    borderRadius: 10,
    padding: 10,
  },
})