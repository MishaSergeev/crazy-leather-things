import { useState } from 'react'
import { useSignUpEmailPassword } from '@nhost/react'
import clsx from 'clsx'

import { useTranslation } from '../../hooks/useTranslation'
import Button from '../Button/Button'
import FormField from "../FormField/FormField"

import classes from './Registration.module.css'

export default function Registration({ onClose }) {
  const t = useTranslation()
  const { signUpEmailPassword, isLoading, isSuccess, needsEmailVerification } = useSignUpEmailPassword()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError(t('registration_password_error'))
      return
    }

    const { error } = await signUpEmailPassword(email, password)

    if (error) {
      setError(error.message)
      return
    } else {
      setError(null)
    }

    onClose()
  }

  return (
    <form className={classes.form_regist} onSubmit={handleSubmit}>
      <FormField
        key="registration_email"
        label="registration_email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        t={t}
      />
      <FormField
        key="registration_password_1"
        label="registration_password_1"
        name="registration_password_1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('registration_password_1')}
        type="password"
        t={t}
      />
      <FormField
        key="registration_password_2"
        label="registration_password_2"
        name="registration_password_2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t('registration_password_2')}
        type="password"
        t={t}
      />

      {isSuccess && !needsEmailVerification && (
        <div className={classes.div_regist_success}>
          {t('registration_success')}
        </div>
      )}
      {needsEmailVerification && (
        <div className={classes.div_regist_warning}>
          {t('registration_check_email')}
        </div>
      )}
      {error && (
        <p
          className={clsx(
            classes.p_regist_error,
            isSuccess && classes.p_login_success
          )}
        >
          {t('error')}
          {error.message
            ? error.message
            : error === 'Email is incorrectly formatted'
              ? t('error_wrong_email')
              : error}
        </p>
      )}

      {isSuccess && (
        <p className={classes.p_login_success}>{t('login_success')}</p>
      )}

      <div className={classes.div_regist_button_wrapper}>
        <Button type="submit" disabled={isLoading}>
          {t('registration_submit')}
        </Button>
      </div>
    </form>
  )
}