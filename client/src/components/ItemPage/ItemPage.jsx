import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useUserData } from '@nhost/react'
import { useAuthenticationStatus } from '@nhost/react'
import EditIcon from '@mui/icons-material/Edit'

import { useTranslation } from '../../hooks/useTranslation'
import { useLanguage } from '../../context/LanguageContext'
import globalDefaults from '../../context/InitialGlobalData'
import Comments from '../Comments/Comments'
import ItemCartButton from '../ItemCartButton/ItemCartButton'
import ItemImg from '../ItemImg/ItemImg'
import Button from '../Button/Button'
import AddComment from '../AddComment/AddComment'
import User from '../User/User'
import Modal from '../Modal/Modal'

import classes from './ItemPage.module.css'

export default function ItemPage({ id, data }) {
  const t = useTranslation()
  const { language } = useLanguage()
  const { isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()
  const isAdmin = user?.defaultRole === 'admin'

  const [isModal, setIsModal] = useState(false)

  const handleClose = () => setIsModal(false)
  const handleCartOpen = () => setIsModal(true)

  const modalContext =
    isAuthenticated && user ? (
      <AddComment Item={id} onClose={handleClose} />
    ) : (
      <User onClose={handleClose} />
    )

  const itemFields = useMemo(
    () => [
      {
        name: t('price'),
        value: `${data.price} ${globalDefaults.currency[language]}`
      },
      { name: t('color'), value: data.color },
      { name: t('inventory'), value: data.inventory }
    ],
    [t, data, language]
  )

  return (
    <div className={classes.div_item_page}>
      <h2 className={classes.h2_item_page}>{data.description}</h2>
      <div className={classes.div_item_parent_page}>
        <div className={classes.div_item_page_img}>
          <ItemImg data={data} />
        </div>
        <div className={classes.div_item_page_info}>
          <div className={classes.div_itempage_description}>
            {data.description_full}
          </div>
          <div className={classes.div_item_page_container}>
            <div>
              {itemFields.map((el) => (
                <div
                  className={classes.div_itempage_attrs_row}
                  key={id + '-info-' + el.name}
                >
                  <span className={classes.span_itempage_label}>{el.name}</span>
                  <span className={classes.span_itempage_value}>{el.value}</span>
                </div>
              ))}
            </div>
            <div>
              <NavLink
                to={data.link + '/Upsert'}
                style={{
                  color: '#000000',
                  textDecoration: 'none',
                  padding: '6%'
                }}
              >
                {isAdmin && <EditIcon />}
              </NavLink>
              <ItemCartButton data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.div_item_page_footer}>
        <h3 className={classes.h3_item_page}>{t('reviews')}</h3>
        <div className={classes.div_item_page_button_wrapper}>
          <Button onClick={handleCartOpen}>{t('new_review')}</Button>
        </div>
      </div>
      <Comments Item={id} />
      <Modal open={isModal} onClose={handleClose} isLogin={true}>
        {modalContext}
      </Modal>
    </div>
  )
}