import { Button, Image, ImageBackground, TextInput, View } from 'react-native'
import useIsMobile from '../../../hooks/useIsMobile'
import variables from '../../../styles/variables'
import { Link } from '@react-navigation/native'
import KIcon from '../../KIcon/KIcon'
import KText from '../../KText'

const TopImg = require('../../../assets/Auth/top.webp')
const LeftImg = require('../../../assets/Auth/left_1920_x2.webp')

const LeftSide = () => {
  const { isMobile } = useIsMobile()

  return (
    <>
      <Image
        source={isMobile ? TopImg : LeftImg}
        resizeMode={isMobile ? 'contain' : 'cover'}
        style={{
          width: isMobile ? '100%' : '50%',
          height: isMobile ? 250 : '100%',
          position: 'relative',
          top: 0,
          // left: 0,
          // right: 0,
          zIndex: -1,
          borderTopRightRadius: isMobile ? 0 : 30,
          borderBottomRightRadius: isMobile ? 0 : 30,
        }}
      />
      {isMobile ? (
        <View
          style={{
            height: 150,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: variables.colors.yellow,
            zIndex: -2,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            display: isMobile ? 'flex' : 'none',
          }}
        />
      ) : (
        <>
          <Link
            to={'/'}
            style={{
              position: 'absolute',
              width: '50%',
              top: 65,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <KIcon name="KazaSwapBlackYellow" style={{ width: 200, height: 150 }} />
          </Link>
          <View
            style={{
              position: 'absolute',
              width: '50%',
              bottom: 65,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <KText style={{ fontSize: 30, fontWeight: '600', lineHeight: 35, maxWidth: 260, textAlign: 'center' }}>
              Swap your place, explore the world
            </KText>

          </View>
        </>
      )}
    </>
  )
}

export default LeftSide