import React, { useEffect, useRef } from 'react'
import useAuthentication from '../../hooks/useAuthentication'
import { StyleSheet } from 'react-native'

export default () => {

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
          text: 'signin_with',
          language: 'en',
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
  const authentication = useAuthentication()

  const handleCredentialResponse = (response: any) => {
    authentication.loginGoogle(response.credential)
  }

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      borderRadius: 23,
      overflow: 'hidden',
      border: `1px solid #ccc`,
      

    },
  })

  return (<div id="googleBtn" style={styles.button} />

  )
}

