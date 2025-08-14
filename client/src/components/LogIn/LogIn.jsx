import { useState } from 'react'
import { useSignInEmailPassword } from '@nhost/react'

import { useQty } from '../../hooks/QtyContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import { fetchUserProfile, syncCart, syncFavorites } from '../../utils/userDataHandlers'
import Button from '../Button/Button';
import FormField from "../FormField/FormField";

import './LogIn.css'

export default function LogIn({ onClose }) {
  const { globalData } = useGlobalData()
  const t = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInEmailPassword, isLoading, error, isSuccess } = useSignInEmailPassword()
  const { addItemToCart, addItemToFavorite } = useQty()

  const handleLogin = async (e) => {
    e.preventDefault()

    const result = await signInEmailPassword(email, password)
    if (result.isError || !result.user) {
      console.error('Login error:', result.error || 'No user')
      return
    }

    const userId = result.user.id

    try {
      await fetchUserProfile(userId)
      await syncCart(userId, globalData)
      await syncFavorites(userId)
      addItemToCart()
      addItemToFavorite()
      onClose()
    } catch (err) {
      console.error('Post-login error:', err)
    }
  }

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <FormField
        key={'login_email'}
        label={'login_email'}
        name={"email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        t={t}
      />
      <FormField
        key={'login_password'}
        label={'login_password'}
        name={"current-password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('login_password')}
        type="password"
        t={t}
      />
      {error && <p className="p-login-error">{t('error')}{error.message==='Incorrect email or password'?t('error_email_pass'):error.message || error}</p>}
      {isSuccess && <p className="p-login-success">{t('login_success')}</p>}
      <div className="div-login-button-wrapper">
        <Button type="submit" disabled={isLoading}>
          {t('login_submit')}
        </Button>
      </div>
    </form>
  )
}
