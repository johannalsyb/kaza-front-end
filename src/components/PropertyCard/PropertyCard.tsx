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
}

const photoStyle: CSSProperties = {
  height: '100%',
  objectFit: 'cover',
}

// const cardWidth = 466
const cardHeight = 330
// const imageHeight = 300
// const avatarHeight = 50

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
  // swapButton,
  onPress,
  onEditPressed,
  hoverable = true,
  bottomComponent,
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
          width: isMobile ? '100%' : variables.propertyCardWidth,
          aspectRatio: bottomComponent ? 'auto' : 1,
          marginBottom: 18
        },
        // @ts-ignore
        isHovered && { boxShadow: '10px 15px 20px 0px #8D835180' },
        style,
      ]}>
      <View style={styles.imageContainer}>
        {photo.startsWith('http') ? (
          <KImage source={photo} style={photoStyle} />
        ) : (
          <KImage imageId={photo} type="properties" style={photoStyle} />
        )}
      </View>

      {/* {swapButton && property && (
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <SwapRequestButton
            property={property}
            buttonStyle="primary"
            iconStyle={{ color: variables.colors.yellow }}
          />
        </View>
      )} */}
      <View style={[styles.infoContainer]}>
        <View style={[styles.infoTopContainer, { paddingTop: 0 }]}>
          <View style={[styles.avatarContainer]}>
            <CircleImage
              imageId={avatar}
              thumbnail={true}
              type="users"
              size="xsmall"
            />
          </View>
        </View>
        <View style={styles.infoBottomContainer}>
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
            />

            {swapFor ? (
              swapForText?.map((s, i) => (
                <KText
                  style={{
                    paddingHorizontal: variables.spacing.xxsmall,
                    fontSize: 13,
                  }}
                  key={`swap-for-${i}`}>
                  {s}
                </KText>
              ))
            ) : (
              <KText
                style={{
                  paddingHorizontal: variables.spacing.xxsmall,
                  fontSize: 13,
                }}>
                Anywhere
              </KText>
            )}
          </KText>
        </View>
        <View style={styles.infoTopContainer}>
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
        </View>
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

const { white, greenLight, yellow } = variables.colors


// padding fix on the design
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 20,
    display: 'flex',
    maxHeight: cardHeight,
    overflow: 'hidden',
    height: '100%'
  },
  imageContainer: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    overflow: 'hidden',
    maxHeight: 214,
    height: '100%',
  },
  infoContainer: {
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    marginBottom: 10,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',

  },
  infoTopContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingTop: 7
  },
  infoBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 0,
  },
  avatarContainer: {
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
