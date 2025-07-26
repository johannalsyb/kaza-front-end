import React, {useEffect, useRef} from 'react';
import useAuthentication from '../../hooks/useAuthentication';
import {StyleSheet, View} from 'react-native';
import KButton from '../KButton/KButton';
import useIsMobile from '../../hooks/useIsMobile';
export default () => {
  const {isMobile} = useIsMobile();
  const authInstance = useRef(window.google?.accounts.id || null);
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        authInstance.current = window.google.accounts.id;
        authInstance.current.initialize({
          client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });
        //@ts-ignore
        // authInstance.current.renderButton(document.getElementById('googleBtn'), {
        //   theme: 'outline',
        //   size: 'large',
        //   text: 'signin_with',
        //   language: 'en',
        // })
      }
    };

    if (window.google) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);
    }
  }, []);
  const authentication = useAuthentication();
  const handleClickGoogleAuth = () => {
    if (authInstance.current) {
      authInstance.current.prompt();
    } else {
      console.error('Google authentication instance is not initialized.');
    }
  };
  const handleCredentialResponse = (response: any) => {
    authentication.loginGoogle(response.credential);
  };

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      borderRadius: 28,
      overflow: 'hidden',
      border: `1px solid #EFF0F6`,
      backgroundColor: '#fff',
      display: 'flex',
      gap: 10,
      flexDirection: 'row',
      fontSize: 14,
      alignItems: 'center',
   height:isMobile?48:45,
      boxShadow: '0 -3px 6px rgba(244, 245, 250, 0.6)',
    },
  });

  // return (<View id="googleBtn" style={[styles.button, { width: 'auto'}]} />)
  return (
    <KButton
      text="Sign in with Google"
      textStyle={{color: isMobile ? '#808080' : 'black', fontWeight: '600'}}
      icon="Google"
      iconStyle={{stroke: 'transparent',width:18,marginRight:10}}
      onPress={() => handleClickGoogleAuth()}
      style={styles.button}
    />
  );
};
