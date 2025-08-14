import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import Menu from '../../components/Menu'
import KText from '../../components/KText'
import Properties from '../../api/properties'
import KModal from '../../components/KModal/KModal'
import Property from '../../components/Views/Property'
import useSwapRequest from '../../hooks/useSwapRequest'
import SubHeader from '../../components/SubHeader/SubHeader'
import { NavStackParamList } from '../../navigation/screens'
import PropertyHead from '../../components/Views/Property/PropertyHead'
import { Property as PropertyT } from '../../common/types/api/properties'
import SlideUpView from '../../components/SlideUpView'


type Props = NativeStackScreenProps<NavStackParamList, 'Property'>

export default ({ route, navigation }: Props) => {
  const [property, setProperty] = useState<PropertyT | undefined>()

    

  const { id } = route.params
  const {
    showModal,
    setShowModal,
  } = useSwapRequest(id)

  useEffect(() => {
    if (route.params.property) setProperty(route.params.property)
    else
      Properties.get(id)
        .then(res => {
          if (!res.data) return
          // console.log(res.data);
          //@ts-ignore
          setProperty(res.data)
        })
        .catch(err => {
          console.log(err)
        })
  }, [id])

  if (!property?.owner) return <KText>Loading...</KText>
  else {
    let { images } = property
    images = Array.isArray(images) ? images.join(',') : images
    return (
      <>
        <SlideUpView delay={0} style={{ flex: 1 }}>
          <View style={{ backgroundColor: 'black', zIndex: 1 }}>
            <SubHeader>
              <PropertyHead
                property={property}
                onBackPress={() =>
                  navigation.canGoBack()
                    ? navigation.goBack()
                    : navigation.navigate('Home')
                }
              />
            </SubHeader>
          </View>
          <Property property={property} id={property.id} />
          <Menu navigate={navigation.navigate} />
          <KModal
            visible={!!showModal}
            setVisibility={() => setShowModal(undefined)}>
            {showModal}
          </KModal>
        </SlideUpView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  lightText: {
    opacity: 0.5,
    width: '100%',
    textAlign: 'left',
  },
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
