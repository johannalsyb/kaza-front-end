import {useEffect, useState} from 'react';
import {
  Button,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import useAuthentication from '../../hooks/useAuthentication';
import KTextInput from '../../components/Form/KTextInput/KTextInput';
import KButton from '../../components/KButton/KButton';
import KText from '../../components/KText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavStackParamList} from '../../navigation/screens';
import FormField from '../../components/Form/FormField/FormField';
import variables from '../../styles/variables';
import useIsMobile from '../../hooks/useIsMobile';
import KIcon from '../../components/KIcon/KIcon';
import auth from '../../api/auth';
import {RegisterFormError} from '../../components/forms/auth/Register';
import KPhoneInputV2 from '../../components/Form/KPhoneInput/KPhoneInputV2';
import {isValidPhoneNumber} from 'libphonenumber-js';
import GoogleLoginButton from '../../components/GoogleAuthButton/GoogleLoginButton';
import LeftSide from '../../components/Screens/Auth/LeftSide';
import VerifyPhone from '../../components/VerifyPhone';
import {toastSuccess} from '../../components/Toast/Toast';

import {showComponentAtom,showModalRegisterPlaceAtom} from '../../atoms';
import React from 'react'
import { useSetAtom } from 'jotai'
import {  } from '../../atoms'

import {Controller, FieldValues, useForm} from 'react-hook-form';
import Modal from '../../components/Modal';
type Props = NativeStackScreenProps<NavStackParamList, 'Login'>;
export default (props: any) => {
  const setShowModalRegisterPlace = useSetAtom(showModalRegisterPlaceAtom)
  const {isMobile} = useIsMobile();
  const authentication = useAuthentication();
  const [body, setBody] = useState({
    firstName: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    authentication.check();
  }, []);

  const {
    handleSubmit,
    control,
    formState: {errors},
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: '',
      surname: '',
      phone: '',
      email: '',
      password: '',
    },
  });

  const [setShowModalComponent] = [useSetAtom(showComponentAtom)];

  const createAccount = async (body: FieldValues) => {
    setLoading(true);
    try {
      const signupBody = {
        email: body.email as string,
        password: body.password as string,
        firstName: body.firstName as string,
        surname: body.surname as string,

        phone: body.phone as string,
      };
      const response = await auth.signup(signupBody);
      // Store credentials for later login after verification
      const storedCredentials = {
        email: response.data.email,
        password: body.password
      };

     setShowModalComponent(
      <VerifyPhone
        onVerified={async () => {
          toastSuccess('Phone verified successfully');
          setShowModalComponent(null);
          try {
            await login(storedCredentials.email, storedCredentials.password);
          } catch (error) {
            console.error('Login failed after verification:', error);
          }
        }}
        onClose={() => {
          setShowModalComponent(null);
          
        }}
      />
    );
    } catch (err: any) {
      const error = err.json;
      if (
        error?.data?.error &&
        error?.data?.error.indexOf('User already exists') >= 0
      ) {
        setError('email', {type: 'manual', message: 'Email already exists'});
      } else if (
        error?.data?.error &&
        error?.data?.error.indexOf('User already exists with verified phone number') >= 0
      ) {
        setError('email', {type: 'manual', message: 'Email already exists with verified phone number'});
      }
    } finally {
      setLoading(false);

    }
  };
  
  const login = async (email: string, password: string) => {
    const user = await authentication.login(email, password);
    if (user) {
      setTimeout(() => {
        if (props.navigation) {
          try {
            props.navigation.navigate('Onboarding');
          } catch (error) {
          }
        } else {
          window.location.href = '/';
        }
      }); 
    } else {
    }
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        height: '100%',
        flex: 1,
        position: 'relative',
width:'100%',
        paddingHorizontal: isMobile ? 0 : 0,
      }}>
      {/* title="Join now!" */}
      <View style={{width: isMobile?'100%':'50%'}}>

      <LeftSide style={styles.leftSide} />
      </View>

      {isMobile ? (
        <View style={styles.containerLogin}>
          <KText
            style={{
              fontSize: 31,
              fontWeight: '600',
              lineHeight: 31,
              textAlign: 'center',
              color: 'black',
              letterSpacing: -0.5,
              marginTop: -30,
            }}>
            Join now!
          </KText>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={{padding: 0}}
        style={{
          width: '100%',
          marginBottom: isMobile ? 30 : 40,
          marginTop: 20,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: 'center',
            height: 900,
            margin: 'auto',
            flex: 1,
            width: '100%',
            maxWidth: isMobile ? '100%' : 410,
            paddingHorizontal: isMobile ? 20 : 10,
            paddingTop: isMobile ? 18 : 0,
          }}>
          {!isMobile && (
            <>
              <KText
                style={{
                  fontSize: 35,
                  fontWeight: '600',
                  marginBottom: 56,
                  lineHeight: 36,
                  textAlign: 'center',
                  maxWidth: 320,
                  letterSpacing: -0.5,
                }}>
                Create your account today!
              </KText>
            </>
          )}
          <View
            style={{
              flexDirection: isMobile ? 'row' : 'row',
              justifyContent: 'space-between',
              width: '100%',
              gap: isMobile ? 14 : 40,
            }}>
            <FormField
              labelAlign="left"
              label={isMobile ? undefined : 'Name'}
              gapBeforeChildren={false}
              gapAfterChildren={false}
              style={{flex: 1, marginBottom: isMobile ? 0 : 20}}>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <KTextInput
                    placeholder="First name"
                    value={value}
                    onChangeText={firstName => onChange(firstName)}
                    inputStyles={{
                      textAlign: 'left',
                      paddingLeft: 20,
                      height: isMobile ? 45 : 40,
                      paddingVertical:5,
                      marginBottom:isMobile? 2.2:3.8
                    }}
                    error={
                      errors.firstName
                        ? (errors.firstName.message as string)
                        : undefined
                    }
                  />
                )}
              />
            </FormField>

            <FormField
              labelAlign="left"
              
              label={isMobile ? undefined : 'Surname'}
              gapBeforeChildren={false}
              gapAfterChildren={false}
              style={{flex: 1, marginBottom: isMobile ? 0 : 20}}>
              <Controller
                control={control}
                name="surname"
                rules={{
                  required: 'First surname is required',
                  minLength: {
                    value: 2,
                    message: 'First surname must be at least 2 characters',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <KTextInput
                    placeholder="Surname"
                    value={value}
                    onChangeText={surname => onChange(surname)}
                    inputStyles={{
                      textAlign: 'left',
                      paddingLeft: 20,
                      paddingVertical: 6,
                  marginBottom:isMobile? 2.2:4.8,
                      height: isMobile ? 45 : 40,
                    }}
                    error={
                      errors.surname
                        ? (errors.surname.message as string)
                        : undefined
                    }
                  />
                )}
              />
            </FormField>
          </View>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : 'Phone'}
            style={{
              zIndex: 5,
              marginBottom: isMobile ? 0 : 20,
              
            }}
            gapBeforeChildren={false}
            gapAfterChildren={false}>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: 'Phone number is required',
                validate: (value: string) => {
                  if (!value) return 'Phone number is required';
                  if (!isValidPhoneNumber(value)) return 'Invalid phone number';
                  return true;
                },
              }}
              render={({field: {onChange, value}}) => (
                <KPhoneInputV2
                  phone={value}
                  onChange={phone => onChange(phone)}
                  error={
                    errors.phone ? (errors.phone.message as string) : undefined
                  }
                />
              )}
            />
          </FormField>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : 'Email'}
            gapBeforeChildren={false}
            gapAfterChildren={false}
            style={{zIndex: 4, marginBottom: isMobile ? 0 : 20}}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              }}
              render={({field: {onChange, value}}) => (
                <KTextInput
                  placeholder={isMobile ? 'E-mail' : 'Add your email'}
                  value={value}
                  onChangeText={email => onChange(email)}
                  inputStyles={{
                    textAlign: 'left',
                    paddingLeft: 20,
                    paddingVertical: 8,
                    marginBottom:3,
                    height: isMobile ? 45 : 40,
                  }}
                  error={
                    errors.email ? (errors.email.message as string) : undefined
                  }
                />
              )}
            />
          </FormField>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : 'Choose password'}
            gapBeforeChildren={false}
            gapAfterChildren={false}
            style={{zIndex: 3, marginBottom: isMobile ? 0 : 20}}>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({field: {onChange, value}}) => (
                <KTextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={password => onChange(password)}
                  rightComponent={
                    <KIcon
                      name={showPassword ? 'eyeOpen' : 'eyeClose'}
                      size={'medium'}
                      style={{
                        marginRight: isMobile ? 10 : 0,
                        opacity: 0.5,
                        height: isMobile ? 45 : 40,
                      }}
                    />
                  }
                  inputStyles={{
                    textAlign: 'left',
                    paddingLeft: 20,
                    paddingVertical: isMobile?13:10.5,
                  }}
                  error={
                    errors.password
                      ? (errors.password.message as string)
                      : undefined
                  }
                  onRightComponentPress={() => setShowPassword(!showPassword)}
                />
              )}
            />
          </FormField>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: isMobile ? '85%' : 274,
              gap: isMobile ? 26 : 38,
            }}>
            <KButton
              text="Create account"
              style={{
                width: '100%',

                marginTop: isMobile ? 9 : 10,
                borderColor: `1px solid ${variables.colors.borderGray}`,
              }}
              textStyle={{
                fontWeight: '600',
              }}
              onPress={handleSubmit(createAccount)}
              disabled={loading}
              loading={loading}
            />
            
            <KText style={styles.dividerContainer}>
              <View style={styles.divider} />
              <span style={{padding: '0 22px'}}>or</span>
              <View style={styles.divider} />
            </KText>
            <GoogleLoginButton />
          </View>
        </View>
      </ScrollView>
      {!isMobile && (
        <View style={{position: 'absolute', top: 20, right: 20}}>
          <KIcon
            name="closeWithBorder"
            size={'large'}
            onPress={() => {
              props.navigation.navigate('Home');
            }}
          />
        </View>
      )}
  
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  containerLogin: {
    display: 'flex',
    justifyContent: 'space-between',

    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',

    flex: 1,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  forgotPassword: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: '#C6C5BA',
  },
  divider: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    height: 1,
  },
  registrationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    color: variables.colors.grey,
    fontSize: 13,
  },
  iconRegister: {
    marginLeft: 10,
    marginRight: 5,
    opacity: 0.5,
    stroke: 'black',
  },
  iconHeart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 13,
    color: 'black',
  },
  leftSide: {
    height: 135,
  },
  containerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  phoneNoInputFieldsMobileView: {
    borderRadius: 28,
  },
  phoneNoInputFieldsDesktopeView: {
    borderRadius: 0,
  },
});
