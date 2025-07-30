import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'
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
import { useRoute } from '@react-navigation/native'

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

const cardHeight = 466

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
  const { user } = useAuthentication()
  const [isHovered, setIsHovered] = useState(false)
  const swapForText = swapFor?.split('\n')
  const availableDateText =
    availableDate?.from && availableDate?.to
      ? `${formatFriendlyDate(availableDate?.from)} - ${formatFriendlyDate(
        availableDate?.to,
      )}`
      : 'Flexible'

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => hoverable && setIsHovered(true)}
      onHoverOut={() => hoverable && setIsHovered(false)}
      style={[
        styles.container,
        {
          width: '100%',
          aspectRatio: bottomComponent ? 'auto' : 1,
          marginBottom: 18
        },
        // @ts-ignore
        // isHovered && { boxShadow: '10px 15px 20px 0px #8D835180' },
        style,
        !isDetails && { maxHeight: 325, height: '100%' }
      ]}>
      <View style={styles.imageContainer}>
        {photo.startsWith('http') ? (
          <KImage source={photo} style={photoStyle} />
        ) : (
          <KImage imageId={photo} type="properties" style={photoStyle} />
        )}
        <View style={[styles.avatarContainer]}>
          <CircleImage
            imageId={avatar}
            thumbnail={true}
            type="users"
            size="xsmall"
          />
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
      <View style={[styles.infoContainer]}>
        <View style={styles.infoTopContainer}>
          <KText style={{ fontSize: 19, fontFamily: 'Plus Jakarta Sans', fontWeight: '500' }}>{property?.owner?.firstName?.split(' ')[0] || ''}'s Place</KText>
          <KButton onPress={() => console.log("Swap now is pressed")} text='Swap now' color={isMobile ? 'light' : 'greenLight'} style={{ width: 'auto', height: 'auto', paddingVertical: 4, paddingHorizontal: 10, borderWidth: 0 }} />
        </View>
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
              <KIcon name='calendar' size='medium' />
              <KText
                style={{
                  paddingHorizontal: variables.spacing.xxsmall,
                  fontSize: 13
                }}>
                {availableDateText}
              </KText>
            </KText>
          }
        </View>
        {isDetails && <View style={styles.infoTopContainer}>
          <IconText
            iconName="calendar"
            text={availableDateText}
            style={[styles.iconText, !isMobile && { paddingVertical: 5 }, { backgroundColor: variables.colors.lightCream, width: 'auto' }]}
            textStyle={{ fontSize: 12 }}
          />

          <Gap size="xsmall" />
          {property && <SwapRequestButton
            property={property}
            buttonStyle="primary"
            hideIcon
          // iconStyle={{ color: variables.colors.yellow }}
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

      {favourite && (
        <KIcon
          size="large"
          name="fav"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: variables.colors.yellow,
            borderRadius: 100,
            stroke: 'black',
            fill: 'black',
            padding: 7,
          }}
        />
      )}
      {bottomComponent || null}
    </Pressable>
  )
}

const { white, yellow } = variables.colors


// padding fix on the design
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    display: 'flex',
    maxHeight: cardHeight,
    overflow: 'hidden',
    height: '100%'
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: 250,
    // maxWidth: 290,
    height: '100%',
  },
  infoContainer: {
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    paddingHorizontal: 10,
    // position: 'absolute',
    marginBottom: 10,
    // bottom: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',
  },
  infoTopContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 2,
    paddingTop: 7
  },
  infoBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: 0,
    minHeight:'auto'
  },
  avatarContainer: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: white,
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
