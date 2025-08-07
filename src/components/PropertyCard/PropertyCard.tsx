import { Pressable, StyleSheet, View, ViewStyle, Platform } from 'react-native'
import { useEffect } from 'react'

import properties from '../../api/properties'
import { IconText } from '../IconText/IconText'
import { CircleImage } from '../CircleImage/CircleImage'
import Gap from '../Gap/Gap'
import variables from '../../styles/variables'
import { formatFriendlyDate } from '../../utils/date'
import KImage from '../KImage/KImage'
import KText from '../KText'
import useIsMobile from '../../hooks/useIsMobile'
import { CSSProperties, useState } from 'react'
import useAuthentication from '../../hooks/useAuthentication'
import KButton from '../KButton/KButton'
import KIcon from '../KIcon/KIcon'
import SwapRequestButton from '../SwapRequestButton/SwapRequestButton'
import { Property } from '../../common/types/api/properties'

type PropertyCardProps = {
  favourite?: boolean
  avatar?: string
  photo?: string
  availableDate?: {
    from: Date | null
    to: Date | null
  }
  location?: string
  swapFor?: string | null
  userId?: string
  style?: ViewStyle
  property?: Property
  swapButton?: boolean
  onPress?: () => void
  onEditPressed?: () => void
  hoverable?: boolean
  bottomComponent?: React.ReactNode
  isDetails?: boolean
}

const photoStyle: CSSProperties = {
  height: '100%',
  objectFit: 'cover',
}

const cardHeight = 310

export const PropertyCard = ({
  avatar = '',
  photo = '',
  favourite,
  userId,
  availableDate,
  swapFor,
  // location,
  style,
  property,
  swapButton,
  onPress,
  onEditPressed,
  hoverable = true,
  bottomComponent,
  isDetails = false,
}: PropertyCardProps) => {
  const { isMobile } = useIsMobile()
  const auth = useAuthentication()
  const { user } = auth
  const [isHovered, setIsHovered] = useState(false)
  const [isFav, setIsFav] = useState(
    property &&
    user &&
    user.favourites &&
    user.favourites.includes(property.id),
  )
  const swapForText = swapFor?.split('\n')
  const availableDateText =
    availableDate?.from && availableDate?.to
      ? `${formatFriendlyDate(availableDate?.from)} - ${formatFriendlyDate(
        availableDate?.to,
      )}`
      : 'Flexible'


  const toggleFav = () => {
    if (!property) return
    properties.favourites
      .toggle(property.id)
      .then(r => {
        setIsFav(r.data.includes(property.id))
        auth.updateUser({
          ...user,
          favourites: Array.isArray(r.data) ? r.data.join(',') : r.data,
        })
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    setIsFav(
      property &&
      user &&
      user.favourites &&
      user.favourites.includes(property.id),
    )
  }, [property])

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => hoverable && setIsHovered(true)}
      onHoverOut={() => hoverable && setIsHovered(false)}
      style={[
        styles.container,
        {
          width: '100%',
          maxWidth: isMobile ? '100%' : 290,
          aspectRatio: bottomComponent ? 'auto' : 1,
          marginBottom: isDetails ? 0 : 18,
          height: isDetails ? 362 : '100%',
        },
        // @ts-ignore
        // isHovered && { boxShadow: '10px 15px 20px 0px #8D835180' },
        style,
        !isDetails && { maxHeight: 325, height: '100%' }
      ]}>
      <View style={[styles.imageContainer,{ borderBottomLeftRadius: isDetails? 0 : 20, borderBottomRightRadius:isDetails? 0:20}]}>
        {photo.startsWith('http') ? (
          <KImage source={photo} style={photoStyle} />
        ) : (
          <KImage imageId={photo} type="properties" style={photoStyle} />
        )}
        <View style={styles.bottomOverlay} />
        <View style={[styles.avatarContainer]}>
          <CircleImage
            imageId={avatar}
            thumbnail={true}
            type="users"
            style={{ borderRadius: 100, height: isDetails?61: 45, width: isDetails?61:45 }}
          />
        {
          !isDetails && (
            <KText style={{ color: variables.colors.white, fontSize: 19, fontFamily: 'Plus Jakarta Sans', fontWeight: '500' }}>{property?.owner?.firstName?.split(' ')[0] || ''}'s Place</KText>
          )
        }
        </View>
      </View>
      {swapButton && property && (
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <SwapRequestButton
            property={property}
            buttonStyle="primary"
            iconStyle={{ color: variables.colors.yellow }}
          />
        </View>
      )}
      
      <View style={[styles.infoContainer,{padding: isDetails ? 0 : 'auto'}]}>
        {/* <View style={styles.infoTopContainer}>
          <KButton onPress={() => console.log("Swap now is pressed")} text='Swap now' color={isMobile ? 'light' : 'greenLight'} style={{ width: 'auto', height: 'auto', paddingVertical: 4, paddingHorizontal: 10, borderWidth: 0 }} />
        </View> */}
       
        {
          !isDetails && (
        <View style={[styles.infoBottomContainer, !isDetails && { paddingTop: 5 }]}>
          <KText
            style={{
              fontSize: 13,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            numberOfLines={1}>
            <KIcon
              name="location"
              size="medium"
              style={{ opacity: 0.5 }}
            />
            <KText
              style={{
                paddingHorizontal: variables.spacing.xxsmall,
                fontSize: 13,
                opacity: 0.5,
              }}>
              {property?.city}, {property?.country}
            </KText>
          </KText>
          {!isDetails &&
            <KText
              style={{
                fontSize: 13,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              numberOfLines={1}
            >
              <KIcon name='calendar' size='medium' style={{ opacity: 0.5 }} />
              <KText
                style={{
                  paddingHorizontal: variables.spacing.xxsmall,
                  fontSize: 13,
                  opacity: 0.5,
                }}>
                {availableDateText} 
              </KText>
            </KText>
          }
        </View>

          )
        }
     
        {isDetails && property?.id && <View style={styles.infoTopContainer}>
          <KText
            style={{
              fontSize: 13,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical:4,
            }}
            numberOfLines={1}>
            <KIcon
              name="location"
              size="medium"
              style={{ opacity: 0.5 }}
            />
            <KText
              style={{
                paddingHorizontal: variables.spacing.xxsmall,
                fontSize: 13,
                
                fontWeight: '500',
                color: '#000000',
              }}>
              {property?.city}, {property?.country}
            </KText>
          </KText>
 
          <Gap size="xsmall" />
          {property && <SwapRequestButton
            property={property}
            buttonStyle="primary"
            hideIcon
            onPress={() => setShowCalendar(true)}
          />}
         
        </View>}
      </View>

      {user && user?.id === userId && (
        
        <KButton
          size="medium"
          text="Edit"
          icon={'edit'}
          color="secondary"
          onPress={() => onEditPressed && onEditPressed()}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        />
      )}
      {
        !isDetails && (
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          borderRadius: 100,
          padding: 7,
        }}
        onPress={() => (user ? toggleFav() : onPress)}
      >
        <KIcon
          size="large"
          name="fav"
          style={{
            borderRadius: 100,
            stroke: favourite ? variables.colors.yellow : variables.colors.white,
            fill: favourite ? variables.colors.yellow : 'transparent',
            padding: 7,
          }}
        />
      </Pressable>
      )
      {bottomComponent || null}
    </Pressable>
  )
}

const { white, yellow } = variables.colors


// padding fix on the design
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    display: 'flex',
    overflow: 'hidden',
    minHeight: cardHeight,
  },
  imageContainer: {
    overflow: 'hidden',
    height: 275,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    ...(Platform.OS === 'web'
      ? {
        backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
      }
      : {
        backgroundColor: 'rgba(0,0,0,0.4)',
      }),
  },
  infoContainer: {
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',
  },
  infoTopContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:white,
    flex: 2,
    paddingVertical:14,
    paddingHorizontal:13

  },
  infoBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 5,
    minHeight: 'auto'
  },
  avatarContainer: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  swapForText: {
    opacity: 0.4,
  },
  iconText: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: yellow,
    borderRadius: 23,
    paddingVertical: 16,
    paddingHorizontal: 8,
    height: 45,
    maxWidth: 152
  },
})
