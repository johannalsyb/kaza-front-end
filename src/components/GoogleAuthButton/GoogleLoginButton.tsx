import React, { useEffect, useRef } from 'react'
import KButton from '../KButton/KButton'
import useIsMobile from '../../hooks/useIsMobile'
import { useGoogleLogin } from '@react-oauth/google'
import useAuthentication from '../../hooks/useAuthentication'

export default () => {
  const { isMobile } = useIsMobile()

  const authInstance = useRef(window.google?.accounts.id || null)
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        authInstance.current = window.google.accounts.id
        authInstance.current.initialize({
          client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || '',
          callback: handleCredentialResponse,
        })
        //@ts-ignore
        authInstance.current.renderButton(document.getElementById('googleBtn'), {
          theme: 'outline',
          size: 'large',
          text: 'Sign in with Google',
          language: 'en',
          shape: 'pill',
        })
      }
    }

    if (window.google) {
      initializeGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle()
          clearInterval(interval)
        }
      }, 100)
    }
  }, [])
  const handleCredentialResponse = (response: any) => {
    console.log('Google ID Token:', response.credential)
    authentication.loginGoogle(response.credential)
  }

  const authentication = useAuthentication()
  const handleCustomGoogleLogin = () => {
    try {
      //@ts-ignore
      console.log('authInstance.current', authInstance.current)
      authInstance.current.prompt()
    } catch (error) {
      console.dir(error)
    }
  }
  // const handleCustomGoogleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log('Google tokenResponse:', tokenResponse)
  //     // Тут ти отримуєш access_token
  //     // Щоб отримати id_token, треба зробити запит до Google UserInfo API:
  //     const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //       headers: {
  //         Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`,
  //       },
  //     })
  //     const userInfo = await res.json()
  //     console.log('Google user info:', userInfo)
  //     // authentication.loginGoogle(tokenResponse)
  //   },
  //   flow: 'implicit',
  // })
  return (<div id="googleBtn" style={{ width: '100%', borderRadius: 23, overflow: 'hidden', border: `1px solid` }}></div>
    // <KButton
    //   color="light"
    //   text="Sign in with Google"
    //   style={{
    //     width: '100%',
    //     marginBottom: isMobile ? 12 : 80,
    //     marginLeft: 56,
    //     marginRight: 56,
    //   }}
    //   icon="Google"
    //   iconStyle={{ stroke: 'transparent' }}
    //   onPress={() => handleCustomGoogleLogin()}
    // />
  )
}

