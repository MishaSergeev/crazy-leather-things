import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gql } from 'graphql-request';
import { useUserData, useAuthenticationStatus } from '@nhost/react';
import CloseIcon from '@mui/icons-material/Close';

import { nhost } from '../../nhost';
import globalDefaults from "../../context/InitialGlobalData";
import { useGlobalData } from '../../context/GlobalDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { useQty } from '../hooks/QtyContext';
import Button from "../Button/Button";
import ItemImg from "../ItemImg/ItemImg";

import './Cart.css';

const DELETE_CART_ITEM = gql`
mutation DeleteCartItem($user_id: uuid!, $item_id: String!) {
  delete_cart(
    where: {
      user_id: { _eq: $user_id }
      item_id: { _eq: $item_id }
    }
  ) {
    affected_rows
  }
}
`
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
export default function Cart({ onClose }) {
    const t = useTranslation();
    const user = useUserData()
    const { language } = useLanguage();
    const { isAuthenticated } = useAuthenticationStatus()
    const { globalData } = useGlobalData()
    const [cartData, setCartData] = useState({ ...globalDefaults.cart });
    const { addItemToCart } = useQty()
    const inputRefs = useRef({});

    const handleFocus = (key) => {
        inputRefs.current[key]?.select();
    };

    const handleQtyChange = async (itemId, currentValue, newValue) => {
        const updatedQty = parseInt(newValue, 10);
        const validQty = (!isNaN(updatedQty) && updatedQty >= 0)
            ? Math.min(updatedQty, globalData.Items[itemId].inventory)
            : currentValue;
        const updatedCart = {
            ...cartData,
            [itemId]: { qty: validQty },
        };
        setCartData(updatedCart);
        if (validQty === 0) {
            removeItemFromCart(itemId)
        } else {
            globalDefaults.cart[itemId].qty = validQty;
        }
        if (isAuthenticated && user && validQty > 0) {
            await nhost.graphql.request(UPSERT_CART, {
                user_id: user.id,
                item_id: itemId,
                qty: Number(validQty),
            });
        }
    };
    const removeItemFromCart = async (itemId) => {
        const updatedCart = { ...cartData };
        delete updatedCart[itemId];
        setCartData(updatedCart);
        delete globalDefaults.cart[itemId];
        addItemToCart()
        if (isAuthenticated && user) {
            try {
                await nhost.graphql.request(DELETE_CART_ITEM, {
                    user_id: user.id,
                    item_id: itemId
                })
            } catch (err) {
                console.error('Error deleting from cart:', err)
            }
        }
    }

    const CartTitle = Object.keys(globalDefaults.cart).length > 0 ?
        <div className='div-title-cart'>
            <div></div>
            <div>{t('iten_name')}</div>
            <div>{t('iten_qty')}</div>
            <div>{t('iten_price')}</div>
            <div></div>
        </div> :
        <></>
    const ItemsInCart = Object.keys(globalDefaults.cart).length > 0 ?
        Object.keys(globalDefaults.cart).map((key) => (
            <div className='div-items-cart-child' key={key}>
                <div className='img-item-cart'>
                    <ItemImg data={globalData.Items[key]} onClick={onClose} />
                </div>
                <NavLink
                    to={globalData.Items[key].link}
                    style={{
                        color: '#000000',
                        textDecoration: 'none'
                    }}
                    onClick={onClose}>
                    <div>{globalData.Items[key].description}</div>
                </NavLink>
                <input
                    ref={(el) => (inputRefs.current[key] = el)}
                    value={globalDefaults.cart[key].qty}
                    onChange={(e) => handleQtyChange(key, globalDefaults.cart[key].qty, e.target.value)}
                    onFocus={() => handleFocus(key)} />
                <div>{globalData.Items[key].price} {globalDefaults.currency[language]}</div>
                <CloseIcon onClick={() => removeItemFromCart(key)} />
            </div>
        )) :
        <div className='div-empty-cart'>{t('cart_empty')}</div>

    let TotalSum = 0
    const Currency = globalDefaults.currency[language]
    for (let key in globalDefaults.cart) {
        TotalSum += globalDefaults.cart[key].qty * globalData.Items[key].price
    }
    const SubmitOrder = Object.keys(globalDefaults.cart).length > 0 ?
        <div className='div-submit-cart-container'>
            <div className='div-cart-total'>{t('sum')} {TotalSum} {Currency}</div>
            <div className="div-cart-button-wrapper">
                <NavLink
                    to="/Submit"
                    style={{
                        color: '#000000',
                        textDecoration: 'none'
                    }}
                    onClick={onClose}>
                    <Button>
                        {t('cart_submit')}
                    </Button>
                </NavLink>
            </div>
        </div> :
        <></>
    return (
        <>
            {CartTitle}
            <div className='div-items-cart-container'>
                <div className='div-items-cart-parent'>
                    {ItemsInCart}
                </div>
                {SubmitOrder}
            </div>
        </>
    );
}