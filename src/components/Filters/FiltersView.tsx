import React from 'react'
import KButton from '../KButton/KButton'
import Dropdown, { DropdownHandle } from '../Dropdown/Dropdown'
import variables from '../../styles/variables'
import { View } from 'react-native'
import { PropertyFilter } from '../Views/Properties/PropertyList'

interface FiltersViewProps {
  ffilters: any
  isMobile: boolean
  flatTypeView: React.ReactNode
  onFilter: (...filters: { type: keyof PropertyFilter, filters: string[] }[]) => void
  filterCount: number
  brFilterRef: React.RefObject<DropdownHandle>
  nbBedroomFilters: string[]
  placeTypeFilters: string[]
}

const bedroomLabelMap: Record<string, string> = {
  '1 BR': '1 Bed Room',
  '2 BR': '2 Bed Rooms',
  '3 BR': '3 Bed Rooms',
  '4+': '4+ Bed Rooms',
}

const FiltersView: React.FC<FiltersViewProps> = ({
  ffilters,
  isMobile,
  onFilter,
  brFilterRef,
  nbBedroomFilters,
}) => (
  <>
    {isMobile &&
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {nbBedroomFilters.map((label) => {
          const isSelected = ffilters.bedrooms.includes(label)
          return (
            <KButton
              key={label}
              text={bedroomLabelMap[label] || label}
              color={isSelected ? 'tertiary' : 'light'}
              onPress={() => {
                const newFilters = isSelected
                  ? ffilters.bedrooms.filter((br: string) => br !== label)
                  : [...ffilters.bedrooms, label]

                onFilter({ type: 'bedrooms', filters: newFilters })
              }}
              style={{
                height: 40,
                paddingHorizontal: 10,
                width: '80%',
                borderWidth: 1,
                borderColor: variables.colors.blackLight,
              }}
            />
          )
        })}
      </View>
    }
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    <KButton
      color={ffilters.petsFriendlyOnly[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'petsFriendlyOnly' as keyof PropertyFilter, filters: ffilters.petsFriendlyOnly[0] === 'false' ? ['true'] : ['false'] })}
      style={{
        flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5,
        paddingRight: 5, height: 40, borderWidth: 1,
        borderColor: variables.colors.blackLight,
      }}
      {...(!isMobile && { icon: 'pet', iconSize: 'medium' })}
      iconSize='medium'
      text='Pet Friendly'
    />
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    <KButton
      color={ffilters.swapWithWomen[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'swapWithWomen' as keyof PropertyFilter, filters: ffilters.swapWithWomen[0] === 'false' ? ['true'] : ['false'] })}
      style={{
        flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5,
        paddingRight: 5, height: 40, borderWidth: 1,
        borderColor: variables.colors.blackLight
      }}
      {...(!isMobile && { icon: 'woman', iconSize: 'medium' })}
      iconSize='medium'
      text='Swap with women'
    />
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    {!isMobile && <KButton
      color={ffilters.kidsFriendlyOnly[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'kidsFriendlyOnly' as keyof PropertyFilter, filters: ffilters.kidsFriendlyOnly[0] === 'false' ? ['true'] : ['false'] })}
      style={{
        flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5,
        paddingRight: 5, height: 40, borderWidth: 1,
        borderColor: variables.colors.blackLight,
      }}
      {...(!isMobile && { icon: 'kids', iconSize: 'medium' })}
      iconSize='medium'
      text='Suitable for children'
    />}
  </>
)

export default FiltersView
