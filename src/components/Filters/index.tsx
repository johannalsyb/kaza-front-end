import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import variables from '../../styles/variables'
import KTextInput from '../Form/KTextInput/KTextInput'
import KIcon from '../KIcon/KIcon'
import Dropdown, { DropdownHandle } from '../Dropdown/Dropdown'
import SubHeader from '../SubHeader/SubHeader'
import useIsMobile from '../../hooks/useIsMobile'
import { Pressable, StyleSheet, View, ViewStyle, Text } from 'react-native'
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

  const nbFilters = (ffilters: PropertyFilter) => {
    let nb = 0
    if (ffilters["placeType"].length !== placeTypeFilters.length) nb++
    if (ffilters["petsFriendlyOnly"][0] !== "false") nb++
    if (ffilters["kidsFriendlyOnly"][0] !== "false") nb++
    if (ffilters["swapWithWomen"][0] !== "false") nb++
    if (ffilters["bedrooms"].length !== nbBedroomFilters.length) nb++
    if (ffilters["startDate"] && ffilters["startDate"][0]) nb++
    if (ffilters["endDate"] && ffilters["endDate"][0]) nb++
    if (search.length) nb++
    return nb
  }

  const clearFilters = () => {
    console.log("clearFilters runs")

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

  const filterCount = nbFilters(filters)

  const flatTypeView = <Dropdown
    ref={flatFilterRef}
    // multiple={true}
    // selectedIndexes={placeTypeFilters.map(i => ffilters.placeType.includes(i))}
    style={{
      backgroundColor: variables.colors.blackLight,
      // width: isMobile ? "50%" : "auto",
      // width: "100%",
      flex: 1,
      height: 40,
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
          marginLeft: isMobile ? 8.5 : 10,
          marginRight: 2.5,
          backgroundColor: variables.colors.orange,
          borderColor: variables.colors.orange,
          // position: !isMobile ? "absolute" : undefined,
          // right: 50
        },
      ]}
      onPress={clearFilters}
      disabled={filterCount === 0}
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
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      onPress={clearFilters}
      disabled={filterCount === 0}
    >
      <KIcon
        name="clearAll"
        size="medium"
      />
      <Text style={{ fontSize: 16 }}>Clear all filters</Text>
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
                { marginLeft: 2.5, marginRight: 2.5 },
                { backgroundColor: variables.colors.black },
              ]}
              onPress={() => setShowFilterModal(true)}>
              <KIcon
                name="filters"
                size="large"
                style={{ stroke: "white" }}
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
            {filterCount > 0 && !isMobile ? clearFiltersView() : null}
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
      {!isMobile && <View style={{
        flex: 1,
        gap: 10,
        marginLeft: 18,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}>
        <DatePicker
          label="Starting date"
          date={startDate}
          onDateSelected={(date: Date | null) => {
            setStartDate(date)
            onFilter({ type: "startDate", filters: date ? [date.toISOString()] : [] })
          }}
        />
        <DatePicker
          label="Ending date"
          date={endDate}
          onDateSelected={(date: Date | null) => {
            setEndDate(date)
            onFilter({ type: "endDate", filters: date ? [date.toISOString()] : [] })
          }}
        />
      </View>}
      <View style={{
        flexDirection: 'row',
        alignItems: "center",
        width: "auto",
        justifyContent: "flex-end"
      }}>
        {!isMobile && filterCount > 0 && clearFiltersView()}
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
              { marginLeft: 2.5, marginRight: 2.5 },
              {
                backgroundColor: variables.colors.black,
                borderColor: variables.colors.white,
              },
            ]}
            onPress={() => setShowDateModal(true)}
          >
            <KIcon
              name="calendarWhite"
              size="large"
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
                <Text style={{ paddingHorizontal: 24, marginBottom: 4, fontSize: 13, fontWeight: '500', fontFamily: 'Plus Jakarta Sans', color: variables.colors.black }}>Select the dates</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: variables.colors.borderGray,
                    borderRadius: 30,
                    width: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginBottom: 16,
                    alignSelf: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>
                    {startDate
                      ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Start Date'} -{' '}
                    {endDate
                      ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'End Date'}
                  </Text>
                </View>

                <DatePicker
                  isOpen
                  isRange
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
                { marginLeft: 2.5, marginRight: 2.5 },
                {
                  backgroundColor: variables.colors.black,
                  borderColor: isMobile ? !showMap ? variables.colors.black : "white" : variables.colors.black,
                },
              ]}
              onPress={() => {
                setShowFilterModal(true)
              }}>
              <KIcon
                name="filters"
                size="large"
                style={{ stroke: "white" }}
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
            <KModalWeb
              isMobile={isMobile}
              showCross={false}
              visible={showFilterModal}
              clearFilters={clearFilters}
              clearFiltersView={modalClearFiltersView}
              setVisibility={() => setShowFilterModal(false)}
              style={{ backgroundColor: variables.colors.white, padding: 20, display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 20 : 0, minWidth: 562 }}
            >
              {filterView}
            </KModalWeb>
          </>
        }
        {/* <View style={{flex: 1}} /> */}
        <MapToggleButton
          showMap={showMap}
          isMobile={isMobile}
          route={route}
          navigation={navigation}
        />
        {/* {!isMobile ? <KButton
          color="secondary"
          onPress={() => user ? setShowSwapNow(true) : setShowSignIn(true)}
          style={{flexDirection: 'row', marginLeft: 10}}>
          <KIcon name="logo" size="medium" style={{stroke: 'black'}} />
          <KText>Swap Now</KText>
        </KButton> : null} */}
      </View>
      {/* TODO: apply modal for datepicker filters for mobile */}
      {/* <KModal
        visible={showDateModal}
        setVisibility={setShowDateModal}
        showCross={true}
        style={{ padding: 20 }}
      >
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', padding: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Dates</Text>
          <DatePicker
            label="Start Date"
            onDateSelected={setStartDate}
          />
          <View style={{ height: 20 }} />
          <DatePicker
            label="End Date"
            onDateSelected={setEndDate}
          />
          <View style={{ height: 30 }} />
          <Pressable
            style={{ backgroundColor: variables.colors.black, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 30 }}
            onPress={() => setShowDateModal(false)}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Apply</Text>
          </Pressable>
        </View>
      </KModal> */}
    </SubHeader>
  )
})

export default Filters

const styles = StyleSheet.create({
  lightCircle: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
