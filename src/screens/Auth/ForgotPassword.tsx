import {useState} from 'react';
import {Button, Image, ImageBackground, TextInput, View} from 'react-native';
import useAuthentication from '../../hooks/useAuthentication';
import KTextInput from '../../components/Form/KTextInput/KTextInput';
import KButton from '../../components/KButton/KButton';
import KText from '../../components/KText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavStackParamList} from '../../navigation/screens';
import FormField from '../../components/Form/FormField/FormField';
import variables from '../../styles/variables';
import useIsMobile from '../../hooks/useIsMobile';
import auth from '../../api/auth';
import {toastSuccess} from '../../components/Toast/Toast';
import KIcon from '../../components/KIcon/KIcon';
import {Link} from '@react-navigation/native';
const TopImg = require('../../assets/Auth/top.webp');
// const LeftImg = require("../../assets/Auth/left_desktop.webp")
const LeftImg = require('../../assets/Auth/left_1920_x2.webp');
type Props = NativeStackScreenProps<NavStackParamList, 'ForgotPassword'>;

export default ({route, navigation}: Props) => {
  const {isMobile} = useIsMobile();
  const [creds, setCreds] = useState({email: ''});
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const resetPassword = () => {
    setLoading(true);
    auth.resetPassword
      .request(creds.email)
      .catch(() => {})
      .finally(() => {
        toastSuccess('Reset instructions sent to your email');
        setLoading(false);
        setDisabled(true);
      });
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        // width: "90%",
        // padding: "15%",
        // flex: 1,
        position: 'relative',
      }}>
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
      <Link
        to={'/'}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%',
        }}>
        <KIcon
          name="KazaSwapBlackYellow"
          style={{width: 70, height: 104, paddingTop: 20}}
        />
      </Link>
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
        <View
          style={{
            position: 'absolute',
            width: '50%',
            bottom: 50,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <KText
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 47,
              textAlign: 'center',
            }}>
            Swap your place, explore the world
          </KText>
          <KText
            style={{
              fontSize: 12,
              color: variables.colors.grey,
              width: '90%',
              textAlign: 'left',
            }}>
            © {new Date().getFullYear()} Kaza Swap LLC. All rights reserved.
          </KText>
        </View>
      )}

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          // flex: 1,
          paddingTop: isMobile ? 15 : 102,
          paddingBottom: isMobile ? 30 : '15%',
          paddingLeft: isMobile ? '5%' : 5,
          paddingRight: isMobile ? '5%' : 5,
          margin: isMobile ? '0%' : 'auto',
          width: isMobile ? '100%' : 415,
          // height: isMobile ? "auto" : "100%",
        }}>
        <KText
          style={{
            fontSize: isMobile ? 20 : 24,
            fontWeight: '500',
            lineHeight: 24,
            marginBottom: isMobile ? 15 : 20,
          }}>
          Forgot Password?
        </KText>
        <KText
          style={{
            color: variables.colors.grey,
            marginBottom: isMobile ? 30 : 40,
            fontSize: 14,
            textAlign: 'center',
          }}>
          No worries, we'll send you reset instructions.
        </KText>

        <FormField labelAlign="center" label="Email">
          <KTextInput
            placeholder="Email"
            value={creds.email}
            onChangeText={email => setCreds({...creds, email})}
          />
        </FormField>

        <KButton
          text={disabled ? 'Reset password instructions sent' : 'Confirm'}
          loading={loading}
          disabled={disabled}
          style={{width: '100%', marginTop: isMobile ? 5 : 0}}
          onPress={resetPassword}
        />
      </View>
      <View
        style={{
          position:  'absolute' ,
          top: !isMobile ? 20 : 'auto',
          bottom:isMobile?30:'auto',
          right: !isMobile ? 20 : 'auto',
          marginBottom: !isMobile ? 'auto' : 30,
        }}>
        {isMobile && (
          <View >
            <KText
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <View style={{display:'flex',flexDirection:'row', gap:4,alignItems:'center',justifyContent:'center'}}>
                <KIcon
                  name="chevronLeft"
                  size={'large'}
                  onPress={() => {
                    navigation.navigate('Login');
                  }}
                  width={25}
                  height={25}
                  style={{opacity:0.6}}
                />
                <KText>{'Back to Log In'}</KText>
              </View>
            </KText>
          </View>
        )}

        {!isMobile && (
          <View style={{position: 'absolute', top: 20, right: 20}}>
            <KIcon
              name="closeWithBorder"
              size={'large'}
              onPress={() => {
                navigation.navigate('Login');
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
