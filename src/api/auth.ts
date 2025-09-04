import type { Api } from '../common/types/api/index'
import api from '.'
import { User } from '../common/types/User'
import storage from '../utils/Storage/storageNew'

export const me = () => api.get<Api.Users.Me>(`/auth/me`)

export const login = async (email: string, password: string) => {
  const res = await api.post<Api.Auth.Login>(`/auth/login`, { email, password })
  await storage.setItem('token', res.data.token)
  return res
}

export const loginGoogle = async (token: string) => {
  const res = await api.post<Api.Auth.LoginGoogle>(`/auth/google/validation`, { token })
  await storage.setItem('token', res.data.token)
  return res
}

export const logout = async () => {
  const res = api.get<Api.Auth.Logout>(`/auth/logout`)
  await storage.removeItem('token')
  return res
}

export const signup = (user: Partial<User> & {
  email: string
  password: string
  firstName: string
  phone: string
}) => api.post<Api.Auth.Signup>(`/auth/signup`, user)

export const resetPasswordRequest = (data: { email?: string, token?: string }) =>
  api.get<Api.Auth.ResetPassword>(
    `/auth/reset?${new URLSearchParams(data).toString()}`
  )

export const resetPasswordUpdate = (data: { password: string, token: string }) =>
  api.post<Api.Auth.ResetPassword>(`/auth/reset`, data)

export const verify = (params: { token?: string, code?: string }) =>
  api.get<Api.Auth.Verify>(
    `/auth/verify?${new URLSearchParams(params).toString()}`
  )

export const changePassword = async () => {
  const res = api.get<Api.Auth.ChangePassword>(`/auth/change-password`)
  return res
}

export default {
  me,
  login,
  loginGoogle,
  logout,
  signup,
  verify,
  resetPassword: {
    request: (email: string) => resetPasswordRequest({ email }),
    isValid: (token: string) => resetPasswordRequest({ token }),
    update: resetPasswordUpdate,
  },
  changePassword: {
    request: (currentPassword: string | undefined, newPassword: string) =>
      api.post<Api.Auth.ChangePassword>(`/auth/change-password`, {
        currentPassword,
        newPassword,
      }),
  },
}
