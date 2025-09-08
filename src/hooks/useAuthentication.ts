import React, { useEffect, useState } from 'react'
import auth from '../api/auth'
import { propertiesAtom, userAtom } from '../atoms'
import { useAtomValue, useSetAtom } from 'jotai'
import { Api, User } from '../common'
import { toastError, toastSuccess, toastWarning } from '../components/Toast/Toast'
import UserEvent from '../events/UserEvent'
import { SwapRequest } from '../common/types/api/swap'
import swaps from '../api/swaps'
import Property from '../common/types/Property'
import { ofUser } from '../api/properties'
import users from '../api/users'
import Notification from '../common/types/Notification'

const TIMEOUT_SEC = 60

export type Authentication = {
  logout: () => void
  login: (email: string, password: string) => Promise<{ user: User | null, needsVerification: boolean }>
  check: (set?: boolean, repeat?: boolean) => Promise<User | void>
  updateUser: (user: Partial<User>) => void
  user?: User
  isAuthLoading: boolean
  isAdmin: boolean
  requests: {
    reload: () => Promise<SwapRequest[]>,
    get: () => Promise<SwapRequest[]>,
  },
  properties: {
    reload: (changeHidden?: boolean) => Promise<Property[]>,
    get: () => Promise<Property[]>,
  },
  notifications: {
    get: () => Promise<Notification[]>,
    read: (notificationId: string) => Promise<string>,
    readAll: () => Promise<string[]>,
  },
  loginGoogle: (body: any) => void
}

const useAuthentication = (): Authentication => {
  const [user, setUser] = [useAtomValue(userAtom), useSetAtom(userAtom)]
  const [properties, setProperties] = [useAtomValue(propertiesAtom), useSetAtom(propertiesAtom)]
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [requests, setRequests] = useState<SwapRequest[]>()
  const [timeout, setTimeoutRef] = useState<NodeJS.Timeout>()
  const userRef = React.useRef(user)

  useEffect(() => {
    if (userRef.current !== user) {
      if (user) {
        // console.log("User logged in")
        new UserEvent("login").emit(user)
        if (timeout) clearInterval(timeout)
        check(false, true) // Check every 60 seconds
      }
      else {
        // console.log("User logged out")
        new UserEvent("logout").emit({})
        if (timeout) clearInterval(timeout)
      }
    }
  }, [user])

  const logout: Authentication['logout'] = () => {
    auth
      .logout()
      .then(() => {
        setUser(undefined)
        if (timeout) clearTimeout(timeout)
      })
      .finally(() => {
        setIsAuthLoading(false)
      })
  }

  const login: Authentication['login'] = async (email, password) => {
    try {
      const res = await auth.login(email, password)
      const user = await check(false) // Don't set user state yet
      if (!user) throw new Error("Login failed")
      
      // Check if phone is verified based on the API response
      if (!user.phoneVerified) {
        // Don't set user state, just return needsVerification: true
        return { user: null, needsVerification: true }
      }
      
      // Only set user state if phone is verified
      setUser(user)
      return { user, needsVerification: false }
      // toastSuccess('Login successful');
    } catch (err) {
      // TODO: Handle error
      console.log(err)
      if (err instanceof Error && err.message === "Phone number not verified") {
        toastError('Please verify your phone number before logging in')
        return { user: null, needsVerification: true }
      } else {
        // For any other error (including invalid credentials), just show login failed
        console.log("Error: ", err)
        toastError('Login failed')
        return { user: null, needsVerification: false }
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  const loginGoogle = async (body: any) => {
    const res = await auth.loginGoogle(body)
    const user = await check(true)
    if (!user) throw new Error("Login failed")
    return user
  }


  const check: Authentication['check'] = (set = false, repeat = false) => {
    return auth
      .me()
      .then(res => {
        if (res.data.unreadNotifications !== undefined) {
          new UserEvent("notification").emit({ unreadNotifications: res.data.unreadNotifications })
        }

        if (res.data.newMatches !== undefined) {
          new UserEvent("match").emit({ newMatches: res.data.newMatches })
        }
        if (set) setUser(res.data)
        return res.data
      })
      .catch(err => {
        // TODO: Handle error
        // console.log(err);
      })
      .finally(() => {
        setIsAuthLoading(false)
        // if(repeat) {
        //   setTimeoutRef(setTimeout(() => {
        //     check(set, user && repeat)
        //   }, 1000*TIMEOUT_SEC))
        // }
      })
  }

  const updateUser = (u: Partial<User>) => setUser({ ...user, ...u as User })

  const req = {
    reload: (): Promise<SwapRequest[]> => {
      return swaps.requests.all()
        .then(res => {
          setRequests(res.data)
          return res.data
        })
        .catch(err => {
          console.log(err)
          setRequests([])
          return []
        })
    },
    get: () => !requests ? req.reload() : Promise.resolve(requests)
  }

  const props = {
    reload: (changeHidden?: boolean): Promise<Property[]> => {
      if (!user) return Promise.resolve([])
      return ofUser("me")
        .then(res => {
          if (changeHidden !== undefined) {
            const fn = !changeHidden ? toastSuccess : toastWarning
            fn(`Your property is now ${!changeHidden ? "visible" : "hidden"}`, "Property visibility")
          }
          setProperties(res.data)
          return res.data
        })
        .catch(err => {
          console.log(err)
          setProperties([])
          return []
        })
    },
    get: () => !properties ? props.reload() : Promise.resolve(properties)
  }

  const notifs = {
    get: () => users.me.notifications.all()
      .then(res => res.data),
    read: (notificationId: string) => users.me.notifications.read(notificationId)
      .then(res => {
        new UserEvent("notification").emit({ unreadNotifications: user && user.unreadNotifications! - 1 > 0 ? user.unreadNotifications! - 1 : 0 })
        return res.data
      })
      .catch(err => {
        console.log(err)
        return ""
      }),
    readAll: () => users.me.notifications.readAll()
      .then(res => {
        new UserEvent("notification").emit({ unreadNotifications: 0 })
        return res.data
      })
  }


  return {
    isAuthLoading,
    user,
    logout,
    login,
    loginGoogle,
    check,
    updateUser,
    requests: req,
    properties: props,
    isAdmin: !!(user && (user.role === "admin" || user.role === "superadmin")),
    notifications: notifs
  }
}

export default useAuthentication
