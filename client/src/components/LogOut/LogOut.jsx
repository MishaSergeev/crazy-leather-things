import { useSignOut } from '@nhost/react'
import { NavLink } from 'react-router-dom'

import { useQty } from '../../hooks/QtyContext'
import { useTranslation } from '../../hooks/useTranslation'
import globalDefaults from '../../context/InitialGlobalData'
import Button from '../Button/Button'

import classes from './LogOut.module.css'

export default function LogOut() {
  const t = useTranslation()
  const { signOut, isLoading } = useSignOut()
  const { addItemToFavorite } = useQty()

  const handleLogout = () => {
    globalDefaults.favorite = {}
    addItemToFavorite()
    signOut()
  }

  return (
    <NavLink to="/">
      <div className={classes.div_logout_button}>
        <Button
          onClick={handleLogout}
          style={{ border: '1px solid #000000' }}
        >
          {isLoading ? t('logout_loading') : t('logout_submit')}
        </Button>
      </div>
    </NavLink>
  )
}