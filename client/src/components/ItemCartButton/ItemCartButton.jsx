import { useState } from 'react'
import { useUserData, useAuthenticationStatus } from '@nhost/react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import clsx from 'clsx'

import { nhost } from "../../nhost"
import { useQty } from '../../hooks/QtyContext'
import { UPSERT_CART } from '../../graphql/queries'
import GlobalData from '../../context/InitialGlobalData'
import Cart from '../Cart/Cart'
import Modal from '../Modal/Modal'

import classes from './ItemCartButton.module.css'

export default function ItemCartButton(...props) {
  const [isMouseOver, setMouseOver] = useState(false)
  const [isModal, setIsModal] = useState(false)

  const { addItemToCart } = useQty()
  const { isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()

  const handleOpen = () => setIsModal(true)
  const handleClose = () => setIsModal(false)

  const addToCartButton = async () => {
    const itemId = props[0].data.id
    const inventory = props[0].data.inventory
    const currentQty = GlobalData.cart[itemId]?.qty

    GlobalData.cart[itemId]
      ? (GlobalData.cart[itemId].qty =
          (currentQty + 1) > inventory ? inventory : (currentQty + 1))
      : (GlobalData.cart[itemId] = { qty: 1 })

    localStorage.setItem('cart', JSON.stringify(GlobalData.cart))

    if (isAuthenticated && user) {
      try {
        await nhost.graphql.request(UPSERT_CART, {
          user_id: user.id,
          item_id: itemId,
          qty: Number(GlobalData.cart[itemId].qty),
        })
      } catch (err) {
        console.error('Cart GraphQL error:', err)
      }
    }

    addItemToCart()
    handleOpen()
  }

  return (
    <>
      <ShoppingCartIcon
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        className={clsx(classes.button_item, {
          [classes.focus]: isMouseOver,
        })}
        onClick={addToCartButton}
      />
      <Modal open={isModal} onClose={handleClose}>
        <Cart onClose={handleClose} />
      </Modal>
    </>
  )
}