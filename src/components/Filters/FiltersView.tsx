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

const FiltersView: React.FC<FiltersViewProps> = ({
  ffilters,
  isMobile,
  onFilter,
  brFilterRef,
  nbBedroomFilters,
}) => (
  <>
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    <KButton
      color={ffilters.petsFriendlyOnly[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'petsFriendlyOnly' as keyof PropertyFilter, filters: ffilters.petsFriendlyOnly[0] === 'false' ? ['true'] : ['false'] })}
      style={{
        flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5,
        paddingRight: 5, height: 40, borderWidth: 1,
        borderColor: variables.colors.blackLight,
      }}
      icon='pet'
      iconSize='medium'
      text='Pet Friendly'
    />
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    <KButton
      color={ffilters.kidsFriendlyOnly[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'kidsFriendlyOnly' as keyof PropertyFilter, filters: ffilters.kidsFriendlyOnly[0] === 'false' ? ['true'] : ['false'] })}
      style={{
        flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5,
        paddingRight: 5, height: 40, borderWidth: 1,
        borderColor: variables.colors.blackLight,
      }}
      icon='kids'
      iconSize='medium'
      text='Suitable for children'
    />
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    <KButton
      color={ffilters.swapWithWomen[0] === 'true' ? 'tertiary' : 'light'}
      onPress={() => onFilter({ type: 'swapWithWomen' as keyof PropertyFilter, filters: ffilters.swapWithWomen[0] === 'true' ? ['false'] : ['true'] })}
      style={{ flexDirection: 'row', width: isMobile ? '80%' : 'auto', paddingLeft: 5, paddingRight: 5, height: 40, borderWidth: 1, borderColor: variables.colors.blackLight }}
      icon='woman'
      iconSize='medium'
      text='Swap with women'
    />
    <View style={{ margin: 5, display: isMobile ? 'flex' : 'none' }} />
    {isMobile &&
      <Dropdown
        ref={brFilterRef}
        style={{
          backgroundColor: variables.colors.blackLight,
          width: isMobile ? '80%' : 'auto',
          height: 40,
          zIndex: 1,
          marginLeft: 5,
        }}
        dropdownStyle={{
          width: isMobile ? '100%' : 'auto',
        }}
        onChange={(values) => onFilter({ type: 'bedrooms' as keyof PropertyFilter, filters: values[0] === 'any' ? nbBedroomFilters : values })}
        leftIcon='bed'
        leftIconStyle={{ stroke: 'white' }}
        items={['any'].concat(nbBedroomFilters)}
      />
    }
  </>
)

export default FiltersView
