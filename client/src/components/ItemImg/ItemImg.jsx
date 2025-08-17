import { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'

import ItemFavoriteButton from '../ItemFavoriteButton/ItemFavoriteButton'
import SwiperItem from '../SwiperItem/SwiperItem'
import SwiperItemImg from '../SwiperItemimg/SwiperItemImg'
import Modal from '../Modal/Modal'

import classes from './ItemImg.module.css'

export default function ItemImg({ data }) {
  const [isModal, setIsModal] = useState(false)
  const location = useLocation()

  const handleOpen = () => {
    if (location.pathname === '/') {
      setIsModal(false)
    } else {
      setIsModal(true)
    }
  }

  const handleClose = () => setIsModal(false)

  const src = data?.src?.split(',')

  return (
    <>
      <ItemFavoriteButton data={data} />
      <NavLink
        to={data.link}
        style={{ display: 'contents' }}
      >
        <SwiperItem onClick={handleOpen} data={src} id={data.id} />
      </NavLink>
      <Modal open={isModal} onClose={handleClose} isItemImg={true}>
        <SwiperItemImg data={src} id={data.id} />
        <h3 className={classes.h3_item_description}>{data.description}</h3>
      </Modal>
    </>
  )
}