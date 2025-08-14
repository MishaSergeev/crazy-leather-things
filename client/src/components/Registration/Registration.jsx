import { useState } from 'react'
import { useSignUpEmailPassword } from '@nhost/react'

import { useTranslation } from '../../hooks/useTranslation';
import Button from '../Button/Button';
import FormField from "../FormField/FormField";

import './Registration.css'

export default function Registration({ onClose }) {
    const t = useTranslation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const { signUpEmailPassword, isLoading, isSuccess, needsEmailVerification } = useSignUpEmailPassword()
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
        <form className="form-regist" onSubmit={handleSubmit}>
            <FormField
                key={'registration_email'}
                label={'registration_email'}
                name={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                t={t}
            />
            <FormField
                key={'registration_password_1'}
                label={'registration_password_1'}
                name={"registration-password-1"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('registration_password_1')}
                type="password"
                t={t}
            />
            <FormField
                key={'registration_password_2'}
                label={'registration_password_2'}
                name={"registration-password-2"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('registration_password_2')}
                type="password"
                t={t}
            />
            {isSuccess && !needsEmailVerification && (
                <div className="div-regist-success">{t('registration_success')}</div>
            )}
            {needsEmailVerification && (
                <div className="div-regist-warning">{t('registration_check_email')}</div>
            )}
            {error && <p className="p-regist-error">{t('error')}{error.message ? error.message : error==='Email is incorrectly formatted'?t('error_wrong_email'):error}</p>}
            {isSuccess && <p className="p-login-success">{t('login_success')}</p>}
            <div className="div-regist-button-wrapper">
                <Button type="submit" disabled={isLoading}>
                    {t('registration_submit')}
                </Button>
            </div>
        </form>
    )
}