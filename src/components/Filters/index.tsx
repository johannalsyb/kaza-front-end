import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import variables from '../../styles/variables'
import KTextInput from '../Form/KTextInput/KTextInput'
import KIcon from '../KIcon/KIcon'
import Dropdown, { DropdownHandle } from '../Dropdown/Dropdown'
import SubHeader from '../SubHeader/SubHeader'
import useIsMobile from '../../hooks/useIsMobile'
import { Pressable, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import KText from '../KText'
import { useSetAtom } from 'jotai'
import { showSignInAtom, showSwapNowAtom } from '../../atoms'
import useAuthentication from '../../hooks/useAuthentication'
import { PropertyFilter } from '../Views/Properties/PropertyList'
import KModalWeb from '../KModal/KModalWeb'
import autocomplete from '../../api/autocomplete'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavStackParamList } from '../../navigation/screens'
import DatePicker from '../DatePicker'
import MapToggleButton from './MapToggleButton'
import FiltersView from './FiltersView'
import DesktopDatePicker from './DesktopDatePicker'
import KFiltersModal from '../KModal/KFiltersModal'

type Props = {
  onShowMap: (show: boolean) => void
  onFilter: (...filters: { type: keyof PropertyFilter, filters: string[] }[]) => void
  onClearFilters: () => void
  onSearch: (search: string) => void
  filters: PropertyFilter
  showSearchBar?: boolean
}

export type Handle = {
  setSearch: (search: string) => void
  clearFilters: () => void
}

export const placeTypeFilters = ['flat', 'house', 'studio', 'room']
export const nbBedroomFilters = ['1 BR', '2 BR', '3 BR', '4+']

const Filters = forwardRef<Handle, Props>(({
  onShowMap,
  onFilter,
  onClearFilters,
  filters,
  onSearch,
  showSearchBar = true
}, ref) => {
  const route = useRoute<RouteProp<NavStackParamList>>()
  const navigation = useNavigation()

  //@ts-expect-error
  const [showMap, setShowMap] = useState(route.params?.map || false)
  const { isMobile } = useIsMobile()
  const setShowSwapNow = useSetAtom(showSwapNowAtom)
  const setShowSignIn = useSetAtom(showSignInAtom)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [search, setSearch] = useState<string>("")
  const { user } = useAuthentication()
  const isFavourites = route.name === "Favourites"

  const flatFilterRef = React.createRef<DropdownHandle>()
  const brFilterRef = React.createRef<DropdownHandle>()
  const [showDateModal, setShowDateModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    onShowMap?.(showMap)
  }, [showMap])

  useEffect(() => {
    if (!route) return
    //@ts-expect-error
    setShowMap(!!route.params?.map)
  }, [route])

  useImperativeHandle(ref, () => ({
    setSearch,
    clearFilters,
  }))

  const nbFilters = (ffilters: PropertyFilter, isMobile: boolean) => {
    let nb = 0
    let showClearButton = false
    if (ffilters["placeType"].length !== placeTypeFilters.length) {
      showClearButton = true
    }
    if (ffilters["petsFriendlyOnly"][0] !== "false") {
      nb++
      showClearButton = true
    }
    if (ffilters["kidsFriendlyOnly"][0] !== "false") {
      nb++
      showClearButton = true
    }
    if (ffilters["swapWithWomen"][0] !== "false") {
      nb++
      showClearButton = true
    }

    if ((ffilters["bedrooms"].length !== nbBedroomFilters.length)) {
      if (isMobile) {
        nb += ffilters["bedrooms"].length
      }
      if (ffilters["bedrooms"].length) showClearButton = true
    }
    if (ffilters["startDate"] && ffilters["startDate"][0]) showClearButton = true
    if (ffilters["endDate"] && ffilters["endDate"][0]) showClearButton = true
    if (search.length) showClearButton = true
    return { nb, showClearButton }
  }

  const clearFilters = () => {
    setModalVisible(false)
    const clearedStart = null
    const clearedEnd = null

    setSearch('')
    onSearch('')
    setStartDate(clearedStart)
    setEndDate(clearedEnd)

    onFilter(
      { type: "placeType", filters: placeTypeFilters },
      { type: "petsFriendlyOnly", filters: ["false"] },
      { type: "kidsFriendlyOnly", filters: ["false"] },
      { type: "swapWithWomen", filters: ["false"] },
      { type: "bedrooms", filters: nbBedroomFilters },
      { type: "startDate", filters: [] },
      { type: "endDate", filters: [] },
    )

    flatFilterRef.current?.setSelectedItems(["any"])
    brFilterRef.current?.setSelectedItems(["any"])
  }

  const { nb, showClearButton } = nbFilters(filters, isMobile)
  const filterCount = nb

  const flatTypeView = <Dropdown
    ref={flatFilterRef}
    // multiple={true}
    // selectedIndexes={placeTypeFilters.map(i => ffilters.placeType.includes(i))}
    style={{
      backgroundColor: variables.colors.blackLight,
      // width: isMobile ? "50%" : "auto",
      // width: "100%",
      flex: 1,
      height: isMobile ? 45 : 40,
      zIndex: 2,
      marginLeft: isMobile ? 10 : 0,
    }}
    dropdownStyle={{
      width: isMobile ? "100%" : "auto",
    }}
    onChange={(values) => onFilter({ type: "placeType", filters: values[0] === "any" ? placeTypeFilters : values })}
    leftIcon="placeType"
    leftIconStyle={{ stroke: "white" }}
    items={['any'].concat(placeTypeFilters)}
  />

  const clearFiltersView = () =>
    <Pressable
      style={[
        styles.lightCircle,
        {
          height: isMobile ? 45 : 40, 
          width: isMobile ? 45 : 40,
          marginLeft: isMobile ? 8.5 : 10,
          marginRight: 2.5,
          backgroundColor: variables.colors.orange,
          borderColor: variables.colors.orange,
        },
      ]}
      onPress={clearFilters}
      disabled={!showClearButton}
    >
      <KIcon
        name="crossCircle"
        size="large"
        style={{
          transform: "scale(1.5)"
        }}
      />
    </Pressable>

  const modalClearFiltersView = () =>
    <Pressable
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}
      onPress={clearFilters}
      disabled={!showClearButton}
    >
      <KIcon
        name="clearAll"
        size="small"
      // style={{opacity: 0.5 }}
      />
      <Text style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: '500' }}>Clear all filters</Text>
    </Pressable>

  const filterView = (
    <FiltersView
      ffilters={filters}
      isMobile={isMobile}
      flatTypeView={flatTypeView}
      onFilter={onFilter}
      filterCount={filterCount}
      brFilterRef={brFilterRef}
      nbBedroomFilters={nbBedroomFilters}
      placeTypeFilters={placeTypeFilters}
    />
  )

  interface Props {
    date: Date | null
    placeholder?: string
    fontSize?: number
  }

  const FormattedDateWithFadedYear: React.FC<Props> = ({
    date,
    placeholder = 'Select Date',
    fontSize = 14,
  }) => {
    if (!date) {
      return <Text style={{ fontSize, opacity: 0.5 }}>{placeholder}</Text>
    }

    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.toLocaleDateString('en-US', { day: 'numeric' })
    const year = date.getFullYear()

    return (
      <Text style={{ fontSize }}>
        {month} {day},{' '}
        <Text style={{ opacity: 0.5 }}>{year}</Text>
      </Text>
    )
  }

  return (
    <SubHeader style={{ paddingVertical: 18, paddingHorizontal: isMobile ? 14 : 30 }}>
      <View style={{ flexDirection: 'row', display: "flex", flex: isMobile ? 1 : undefined }}>
        {!isMobile ?
          <KTextInput
            placeholder="Where would you like to go?"
            topStyle={{ width: 290, height: !showSearchBar ? 0 : 40, marginRight: 10, flex: 1, opacity: !showSearchBar ? 0 : 1, justifyContent: "center" }}
            inputStyles={{ textAlign: 'left', marginLeft: 6 }}
            editable={showSearchBar}
            leftComponent={<KIcon name="search" size="medium" style={{ opacity: 0.5 }} />}
            value={search}
            onChangeText={(text) => setSearch(text)}
            suggestionCallback={(text) => {
              return autocomplete.zone(text)
                .then((res) => {
                  return res.data.results.map((r: any) => r.description)
                })
            }}
            onSuggestionSelected={(text) => {
              onSearch(text)
              setSearch(text)
            }}
          />
          :
          <View style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
          }}>
            <Pressable
              style={[
                styles.lightCircle,
                { marginLeft: 2.5, marginRight: 2.5, borderWidth: 0, height: isMobile ? 45 : 40, width: isMobile ? 45 : 40 },
                { backgroundColor: showFilterModal || filterCount ? variables.colors.black : variables.colors.white },
              ]}
              onPress={() => setShowFilterModal(true)}>
              <KIcon
                name="filters"
                size="large"
                style={{ stroke: showFilterModal || filterCount ? variables.colors.white : variables.colors.black }}
              />
              <View style={{
                position: "absolute",
                top: 8,
                right: -10,
                width: 20,
                height: 20,
                borderRadius: 50,
                backgroundColor: variables.colors.orange,
                display: filterCount ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <KText style={{ color: "white", fontSize: 10 }}>{filterCount}</KText>
              </View>
            </Pressable>
            {flatTypeView}
            {showClearButton ? clearFiltersView() : null}
            <KModalWeb
              isMobile={isMobile}
              clearFilters={clearFilters}
              visible={showFilterModal}
              setVisibility={() => setShowFilterModal(false)}
              style={{ backgroundColor: variables.colors.white, padding: 20 }}
            >
              {filterView}
            </KModalWeb>
          </View>
        }
      </View>
      {!isMobile && (
        <DesktopDatePicker
          isMobile={isMobile}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onFilter={onFilter}
        />
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: "center",
        width: "auto",
        justifyContent: "flex-end"
      }}>
        {!isMobile && showClearButton && clearFiltersView()}
        {!isMobile && flatTypeView}
        {!isMobile && <Dropdown
          // multiple={true}
          // selectedIndexes={placeTypeFilters.map(i => filters.placeType.includes(i))}
          ref={brFilterRef}
          style={{
            backgroundColor: variables.colors.blackLight,
            width: isMobile ? "80%" : "auto",
            height: 40,
            zIndex: 1,
            marginLeft: 5,
            marginRight: 10,
          }}
          dropdownStyle={{
            width: isMobile ? "100%" : "auto",
          }}
          onChange={(values) => onFilter({ type: "bedrooms", filters: values[0] === "any" ? nbBedroomFilters : values })}
          leftIcon="bed"
          leftIconStyle={{ stroke: "white" }}
          items={['any'].concat(nbBedroomFilters)}
        />}
        {isMobile ?
          <Pressable
            style={[
              styles.lightCircle,
              { marginLeft: 2.5, marginRight: 2.5, height: 45, width: 45 },
              {
                backgroundColor: showDateModal ? variables.colors.black : variables.colors.white,
                borderColor: variables.colors.white,
              },
            ]}
            onPress={() => setShowDateModal(true)}
          >
            <KIcon
              name={showDateModal ? "calendarWhite" : "calendar"}
              size="xxlarge"
              style={{ stroke: "white" }}
            />
            <KModalWeb
              isMobile
              title={"Dates"}
              showCross={false}
              visible={showDateModal}
              setVisibility={() => setShowDateModal(false)}
              clearFilters={clearFilters}
              style={{ backgroundColor: variables.colors.white }}
            >
              <View style={{ flex: 1, width: '100%' }}>
                <Text
                  style={{
                    paddingHorizontal: 24,
                    marginBottom: 4,
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: 'Plus Jakarta Sans',
                    color: variables.colors.black,
                    opacity: 0.5
                  }}
                >
                  Select the dates
                </Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderRadius: 30,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 4.5,
                    paddingHorizontal: 20,
                    alignSelf: 'center',
                    minWidth: '90%',
                    justifyContent: 'center',
                    borderColor: variables.colors.borderGray,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      gap: 10,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      paddingLeft: 20,
                    }}
                  >
                    <FormattedDateWithFadedYear date={startDate} placeholder="Start Date" fontSize={16} />
                    <Text style={{ fontSize: 14, opacity: 0.5 }}>-</Text>
                    <FormattedDateWithFadedYear date={endDate} placeholder="End Date" fontSize={16} />
                  </View>
                  <KIcon name={'down'} size={30} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                <DatePicker
                  isOpen
                  isRange
                  isMobile={isMobile}
                  startDate={startDate}
                  endDate={endDate}
                  onRangeSelected={(startDate: Date | null, endDate: Date | null) => {
                    setStartDate(startDate)
                    setEndDate(endDate)
                    if (startDate) {
                      onFilter({ type: 'startDate', filters: [startDate.toISOString()] })
                    }
                    if (endDate) {
                      onFilter({ type: 'endDate', filters: [endDate.toISOString()] })
                    }
                  }}
                />
              </View>
            </KModalWeb>
          </Pressable>
          :
          <>
            <Pressable
              style={[
                styles.lightCircle,
                { height: isMobile ? 45 : 40, width: isMobile ? 45 : 40 }, 
                { marginLeft: 2.5, marginRight: 2.5 },
                {
                  backgroundColor: modalVisible || filterCount ? variables.colors.black : variables.colors.white,
                  borderColor: isMobile ? !showMap ? variables.colors.black : "white" : variables.colors.black,
                },
              ]}
              onPress={() => {
                setModalVisible(true)
              }}>
              <KIcon
                name="filters"
                size="large"
                style={{ stroke: modalVisible || filterCount ? variables.colors.white : variables.colors.black }}
              />
              <View style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 20,
                height: 20,
                borderRadius: 50,
                backgroundColor: variables.colors.orange,
                display: filterCount ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <KText style={{ color: "white", fontSize: 10 }}>{filterCount}</KText>
              </View>
            </Pressable>
            <KFiltersModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              clearButton={modalClearFiltersView()}
              filterView={filterView}
            />
          </>
        }
        <MapToggleButton
          showMap={showMap}
          isMobile={isMobile}
          route={route}
          navigation={navigation}
        />
      </View>
    </SubHeader>
  )
})

export default Filters

const styles = StyleSheet.create({
  lightCircle: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
