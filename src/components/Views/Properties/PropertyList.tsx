import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Property } from '../../../common/types/api/properties'
import { NavStackParamList } from '../../../navigation/screens'
import useAuthentication from '../../../hooks/useAuthentication'
import useIsMobile from '../../../hooks/useIsMobile'
import Filters, { placeTypeFilters, Handle } from '../../Filters'
import MapView from '../../MapView'
import variables from '../../../styles/variables'
import { PropertyCard } from '../../PropertyCard/PropertyCard'
import Menu from '../../Menu'
import useConfig from '../../../hooks/useConfig'
import KText from '../../KText'
import KButton from '../../KButton/KButton'
import Footer from '../../Footer'
import Modal from '../../Modal'
import { useAtom } from 'jotai'
import { showModalRegisterPlaceAtom } from '../../../atoms'
import SlideUpView from '../../../components/SlideUpView'

type PProperty = Property & { bubble?: string }

// this is a test comment for production in main

type Props = {
  properties: PProperty[]
  navigation: NativeStackNavigationProp<
    NavStackParamList,
    'Properties' | 'Matching' | 'Favourites',
    undefined
  >
  emptyListView: React.ReactNode
  onSearch: (search: string) => void
  onShowMore: (() => void) | null
  showSearchBar?: boolean
  loading?: boolean
}

export type PropertyFilter = {
  placeType: string[]
  bedrooms: string[]
  petsFriendlyOnly: string[]
  kidsFriendlyOnly: string[]
  swapWithWomen: string[]
  startDate: string[]
  endDate: string[]
}

const defaultFilters: PropertyFilter = {
  bedrooms: [],
  petsFriendlyOnly: ['false'],
  kidsFriendlyOnly: ['false'],
  swapWithWomen: ['false'],
  placeType: placeTypeFilters,
  startDate: [''],
  endDate: ['']
}

export default forwardRef<Handle, Props>(
  (
    {
      properties,
      navigation,
      emptyListView,
      onSearch,
      onShowMore,
      loading,
      showSearchBar = true,
    },
    ref,
  ) => {
    const [showMap, setShowMap] = useState(false)
    const [columns, setColumns] = useState(0)
    const [filters, setFilters] = useState<PropertyFilter>(defaultFilters)
    const [contentHeight, setContentHeight] = useState(-1)
    const [scrollViewHeight, setScrollViewHeight] = useState(-1)
    const [showModalAuthCreateAccount, setShowModalAuthCreateAccount] = useAtom(showModalRegisterPlaceAtom)
    const { isMobile } = useIsMobile()
    const { user, isAdmin } = useAuthentication()

    const { config, overlay } = useConfig()

    const isInFavourites = navigation.getState().routes[navigation.getState().index].name === 'Favourites'

    const filtersRef = useRef<Handle>(null)

    useImperativeHandle(ref, () => ({
      setSearch: (search: string) => {
        filtersRef.current?.setSearch(search)
      },
      clearFilters: () => {
        setFilters(defaultFilters)
        filtersRef.current?.setSearch('')
        onSearch('')
      },
    }))

    const calculateNumberOfColumns = (width: number) => {
      const columnCount = Math.floor(width / variables.propertyCardWidth)
      return columnCount > 0 ? columnCount : 1
    }

    useEffect(() => {
      if (showMap) {
        // force rerender
        setShowMap(false)
        setTimeout(() => setShowMap(true), 0)
      }
    }, [filters])

    useEffect(() => {
      if (isMobile) {
        setFilters(prev => ({
          ...prev,
          bedrooms: [],
        }))
      }
    }, [isMobile])

    const propertiesFiltered =
      properties?.filter(p => {
        let visible = true
        if (!filters['placeType'].includes(p.type)) visible = false
        if (
          filters['bedrooms'][0] !== 'any' &&
          parseInt(filters['bedrooms'][0]) > p.bedrooms
        )
          visible = false
        if (filters['petsFriendlyOnly'][0] === 'true' && !p.pets)
          visible = false
        if (filters['kidsFriendlyOnly'][0] === 'true' && !p.childrenAllowed)
          visible = false
        if (
          filters['swapWithWomen'][0] === 'true' &&
          !(p.owner.gender === 'female')
        )
          visible = false

        // --- DATE FILTERS ---
        const propertyStart = p.owner.dateFrom ? new Date(p.owner.dateFrom) : null
        const propertyEnd = p.owner.dateTo ? new Date(p.owner.dateTo) : null
        const filterStart = filters['startDate'][0] ? new Date(filters['startDate'][0]) : null
        const filterEnd = filters['endDate'][0] ? new Date(filters['endDate'][0]) : null

        // If both startDate and endDate are set, check for overlap
        if (filterStart && filterEnd) {
          if (!propertyStart && !propertyEnd) {
            visible = false
          } else if (propertyStart && propertyEnd) {
            // No overlap
            if (propertyEnd < filterStart || propertyStart > filterEnd) visible = false
          } else if (propertyStart && propertyStart > filterEnd) {
            visible = false
          } else if (propertyEnd && propertyEnd < filterStart) {
            visible = false
          }
        }
        // --- END DATE FILTERS ---

        return visible
      }) || []

    const isContentSmallerThanScreen = () => {
      if (contentHeight === -1 || scrollViewHeight === -1) return false
      return contentHeight < scrollViewHeight
    }

    const handleClikOpenDetailInfo = (id: string, property: Property) => {
      if (!user) {
        setShowModalAuthCreateAccount(true)
        return

      }
      navigation.navigate('Property', { id, property })
    }

    return (
      <>
        <View style={{ backgroundColor: 'black', zIndex: 1 }}>
          {!isInFavourites && <Filters
            ref={filtersRef}
            showSearchBar={showSearchBar}
            filters={filters}
            onShowMap={setShowMap}
            onFilter={(...nfilters) => {
              const ufilters = { ...filters }
              nfilters.forEach(({ type, filters }) => {
                ufilters[type] = filters
              })
              setFilters(ufilters)
            }}
            onSearch={onSearch}
            onClearFilters={() => {
              setFilters(defaultFilters)
              filtersRef.current?.setSearch('')
              filtersRef.current?.clearFilters()
            }}
          />}
        </View>
        {showMap ? (
          <SlideUpView delay={0} style={{ flex: 1}}>
            <View style={{ display: 'flex', flex: 1 }}>
              <MapView
                lat={30}
                lng={20}
                points={propertiesFiltered?.map(p => ({
                  lat: p.approxLat || 0,
                  lng: p.approxLon || 0,
                  property: p,
                }))}
                zoom={2.5}
                style={{
                  width: '100%',
                  height: '100%',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  marginBottom: 125,
                }}
              />
              <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                <Footer />
              </View>
            </View>
            </SlideUpView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: isMobile ? variables.colors.greenLight : variables.colors.white,
              borderTopLeftRadius: isMobile ? 0 : 20,
              borderTopRightRadius: isMobile ? 0 : 20,
            }}
            onLayout={e => {
              setColumns(calculateNumberOfColumns(e.nativeEvent.layout.width))
              setScrollViewHeight(e.nativeEvent.layout.height)
            }}
            contentContainerStyle={{
              flexDirection: 'column',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: isMobile ? variables.spacing.xsmall : 0,
              flex: isContentSmallerThanScreen() ? 1 : undefined,
              display: 'flex',
            }}>
            <SlideUpView delay={0} style={{ flex: 1, width: '100%' }}>
              <View
                onLayout={e => {
                  setContentHeight(e.nativeEvent.layout.height)
                }}
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: variables.spacing.xsmall,
                  display: 'flex',
                  width: '100%',
                }}>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={variables.colors.white}
                    style={{ marginTop: 20 }}
                  />
                ) : propertiesFiltered.length ? (
                  <>
                    {propertiesFiltered.map((property, i) => {
                      let { images, owner, city, country, id } = property
                      images = Array.isArray(images) ? images.join(',') : images
                      return (
                        <View
                          style={[
                            {
                              flexGrow: 1,
                              flexShrink: 1,
                              padding: isMobile ? 0 : 20,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                            isMobile && {
                              width: '100%',
                              marginBottom: 10,
                            },
                          ]}
                          key={`property-${i}`}>
                          <PropertyCard
                            property={property}
                            favourite={
                              user &&
                                user.favourites &&
                                property &&
                                user.favourites.includes(property.id)
                                ? true
                                : false
                            }
                            onPress={() => handleClikOpenDetailInfo(id, property)}
                            photo={`${id}/${(images ?? '').split(',')[0]}`}
                            avatar={`${owner.id}/${owner.primaryImage}`}
                            location={`${city}`}
                            swapFor={owner.swapLocations || 'Flexible'}
                          // availableDate={{
                          //   from: owner.dateFrom
                          //     ? new Date(owner.dateFrom)
                          //     : null,
                          //   to: owner.dateTo ? new Date(owner.dateTo) : null,
                          // }}
                          />
                          {property.bubble ? (
                            <KText
                              style={{
                                position: 'absolute',
                                top: isMobile ? 0 : 5,
                                right: 0,
                                backgroundColor: variables.colors.orange,
                                color: 'white',
                                padding: 5,
                                borderRadius: 30,
                                zIndex: 10,
                                fontSize: 12,
                              }}>
                              {property.bubble}
                            </KText>
                          ) : null}
                        </View>
                      )
                    })}
                    {(() => {
                      const remainder = propertiesFiltered.length % columns
                      const placeholders = remainder === 0 ? 0 : columns - remainder

                      return Array.from({ length: placeholders }).map((_, i) => (
                        <View
                          key={`shimmer-${i}`}
                          style={{ padding: 20 }}
                        >
                          <View
                            style={{
                              width: variables.propertyCardWidth,
                              height: 308,
                              maxWidth: 315,
                              borderRadius: 10,
                              paddingVertical: 20,
                              backgroundColor: variables.colors.white,
                              marginHorizontal: isMobile ? 0 : 20,
                            }}
                          />
                        </View>
                      ))
                    })()}
                    {onShowMore && (
                      <View
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <KButton
                          onPress={onShowMore}
                          color="primary"
                          style={{
                            width: isMobile ? '100%' : 'auto',
                            paddingLeft: 16,
                            paddingRight: 4,
                            display: 'flex',
                            marginTop: isMobile ? 10 : 71,
                            marginBottom: isMobile ? 0 : 55,
                          }}
                          icon="arrowDown"
                          iconPosition='right'
                          iconStyle={{ stroke: 'white', opacity: 0.5, marginTop: 4, marginLeft: -1 }}
                          textStyle={{ color: 'white' }}
                          text="Load More"
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <View style={{ width: '100%', }}>{emptyListView}</View>
                )}
                {Array.from(
                  {
                    length: columns <= properties.length + 1 ? columns : 0,
                  },
                  (_, i) => (
                    <View
                      key={`empty-${i}`}
                      style={{
                        width: variables.propertyCardWidth,
                        marginHorizontal: isMobile ? 0 : 20,
                      }}
                    />
                  ),
                )}
              </View>
              {isMobile ? (
                <View style={{ height: 100, width: '100%' }} />
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <View
                style={{
                  display: 'flex',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <Footer route={navigation.getState().routes[0].name} />
              </View>
              </SlideUpView>
          </ScrollView>
        )}

        <Menu navigate={navigation.navigate} />
        {showModalAuthCreateAccount && <Modal
          isSignIn
          setOpen={setShowModalAuthCreateAccount}
          title='Create account'
          button={
            {
              label: 'Create account',
              onPress: () => {
                navigation.navigate('SignUp')
                setShowModalAuthCreateAccount(false)
              }
            }
          }
          navigation={navigation}
          description='You need to create an account <br/> to see more details.' />}

      </>
    )
  },
)
