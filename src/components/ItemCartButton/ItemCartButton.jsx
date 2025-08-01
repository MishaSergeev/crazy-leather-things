import { useState } from 'react'
import { gql } from "graphql-request";
import { useUserData } from '@nhost/react';
import { useAuthenticationStatus } from '@nhost/react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { nhost } from "../../nhost";
import { useQty } from '../hooks/QtyContext';
import GlobalData from '../../context/InitialGlobalData';
import Cart from '../Cart/Cart';
import Modal from '../Modal/Modal';

import classes from './ItemCartButton.module.css'

const UPSERT_CART = gql`
  mutation UpsertCart($item_id: String!, $user_id: uuid!, $qty: numeric!) {
    insert_cart(
      objects: {
        item_id: $item_id
        user_id: $user_id
        qty: $qty
      }
      on_conflict: {
        constraint: cart_pkey
        update_columns: [qty]
      }
    ) {
      affected_rows
    }
  }
`;
export default function ItemCartButton(...props) {
  const [isMouseOver, setMouseOver] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const { addItemToCart } = useQty()
  const { isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()
  const handleOpen = () => setIsModal(true);
  const handleClose = () => setIsModal(false);
  const addToCartButton = async () => {
    const itemId = props[0].data.id
    const inventory = props[0].data.inventory
    const currentQty = GlobalData.cart[itemId]?.qty
    GlobalData.cart[itemId] ?
      (GlobalData.cart[itemId].qty = (currentQty + 1) > inventory ? inventory : (currentQty + 1)) :
      (GlobalData.cart[itemId] = {
        qty: 1
      }
      )
    localStorage.setItem('cart', JSON.stringify(GlobalData.cart));
    if (isAuthenticated && user) {
      try {
        await nhost.graphql.request(UPSERT_CART, {
          user_id: user.id,
          item_id: itemId,
          qty: Number(GlobalData.cart[itemId].qty)
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
        className={isMouseOver ? `${classes['button-item']} ${classes.focus}` : classes['button-item']}
        onClick={addToCartButton} />
      <Modal open={isModal} onClose={handleClose}>
        <Cart onClose={handleClose} />
      </Modal>
    </>
  )
}