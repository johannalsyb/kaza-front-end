import {
  Button,
  Image,
  Dimensions,
  ImageBackground,
  TextInput,
  View,
} from 'react-native';
import useIsMobile from '../../../hooks/useIsMobile';
import variables from '../../../styles/variables';
import {Link} from '@react-navigation/native';
import KIcon from '../../KIcon/KIcon';
import KText from '../../KText';
import useResizeImage from '../../../hooks/useResizeImage';

const TopImg = require('../../../assets/Auth/top.webp');
const LeftImg = require('../../../assets/Auth/left_1920_x2.webp');

interface LeftSideProps {
  style?: object;
  title?: string;
}

const LeftSide = (props: LeftSideProps) => {
  const {isMobile} = useIsMobile();
  const {style, title} = props;
  const {width} = Dimensions.get('window');
  
  return (
    <>
      <Image
        source={isMobile ? TopImg : LeftImg}
        resizeMode={isMobile ? 'contain' : 'stretch'}
        style={{
          width: isMobile ? '100%' : width * 0.5,
          height: isMobile ? 240 : '100%',
          position: 'relative',

          top:  isMobile ? -5:-0,
          left:  0,
          zIndex: -1,
          marginBottom: isMobile ? 24 : 0,
          borderTopRightRadius: isMobile ? 0 : 30,
          borderBottomRightRadius: isMobile ? 0 : 30,
          
        }}
      />

      {isMobile && (
        <Link to={'/'} style={{position: 'absolute', top: 20, left: 20}}>
          <KIcon
            name="backArrow"
            size={'large'}
            style={{backgroundColor: 'white', borderRadius: 50, padding: 5}}
          />
        </Link>
      )}
      {isMobile ? (
        <>
          <View
            style={{
              height: 100,
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
              ...style,
            }}
          />

        
        </>
      ) : (
        <>
          <Link
            to={'/'}
            style={{
              position: 'absolute',
              width: '50%',
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <KIcon
              name="KazaSwapBlackYellow"
              style={{width: 70, height: 104, paddingTop: 20}}
            />
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
            <KText
              style={{
                fontSize: 30,
                fontWeight: '600',
                lineHeight: 35,
                textAlign: 'center',
              }}>
              Swap your place, explore the world
            </KText>
          </View>
        </>
      )}
    </>
  );
};

export default LeftSide;

