import { useState } from 'react'
import { useSignInEmailPassword } from '@nhost/react'
import { gql } from "graphql-request";

import { nhost } from "../../nhost";
import { useQty } from '../hooks/QtyContext';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import globalDefaults from "../../context/InitialGlobalData"
import Button from '../Button/Button';

import './LogIn.css'

const GET_PROFILE = gql`
  query GetProfile($id: uuid!) {
    profiles(where: { id: { _eq: $id } }) {
      id
      first_name
      last_name
      birthday
      email
      phone
      about
      country
      city
      street
      building
      apartment
      zip_code
    }
  }
`;

const GET_CART = gql`
  query GetCart($user_id: uuid!) {
    cart(where: { user_id: { _eq: $user_id } }) {
      item_id
      qty
    }
  }
`;

const GET_FAVORITES = gql`
  query GetFavorites($user_id: uuid!) {
    favorites(where: { user_id: { _eq: $user_id } }) {
      item_id
    }
  }
`;
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

export default function LogIn({ onClose }) {
  const { globalData } = useGlobalData()
  const t = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInEmailPassword, isLoading, error, isSuccess } = useSignInEmailPassword()
  const { addItemToCart } = useQty()
  const { addItemToFavorite } = useQty()
  const handleLogin = async (e) => {
    e.preventDefault()

    const result = await signInEmailPassword(email, password)

    if (result.isError) {
      console.error('Login error:', result.error)
      return
    }
    const user = result.user
    if (!user) {
      console.error('User not found after login')
      return
    }

    try {
      nhost.graphql
        .request(GET_PROFILE, { id: user.id })
        .then((res) => {
          globalDefaults.User = res.data?.profiles[0];
        })
        .catch(console.error);
    } catch (err) {
      console.error('User data error:', err)
    }
    try {
      const { data, error } = await nhost.graphql.request(GET_CART, {
        user_id: user.id,
      });
      if (Object.keys(data.cart).length > 0) {
        data.cart.forEach(el => {
          globalDefaults.cart[el.item_id] ?
            (globalDefaults.cart[el.item_id].qty = (globalDefaults.cart[el.item_id].qty + el.qty) > globalData.Items[el.item_id].inventory ? globalData.Items[el.item_id].inventory : globalDefaults.cart[el.item_id].qty + el.qty) :
            (globalDefaults.cart[el.item_id] = {
              qty: globalData.Items[el.item_id].inventory && el.qty > globalData.Items[el.item_id].inventory ? globalData.Items[el.item_id].inventory : el.qty,
            }
            )
        })
      }
      if (error) {
        console.error('GraphQL error:', error)
      } 
      if (Object.keys(globalDefaults.cart).length > 0) {
        for (let key in globalDefaults.cart) {
          await nhost.graphql.request(UPSERT_CART, {
            user_id: user.id,
            item_id: key,
            qty: Number(globalDefaults.cart[key].qty),
          });
        }
      }
    } catch (err) {
      console.error('cart data error:', err)
    }
    try {
      const { data, error } = await nhost.graphql.request(GET_FAVORITES, {
        user_id: user.id,
      });
      if (Object.keys(data.favorites).length > 0) {
        data.favorites.forEach(el => {
          globalDefaults.favorite[el.item_id] = {
            id: el.item_id,
          }
        })
      }
      if (error) {
        console.error('GraphQL error:', error)
      }
    } catch (err) {
      console.error('Favorites error:', err)
    }
    addItemToCart()
    addItemToFavorite()

    onClose()
  }

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <div className="div-login-input">
        {t('login_email')}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
        />
      </div>
      <div className="div-login-input">
        {t('login_password')}:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('login_password')}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="p-login-error">{t('error')}{error.message ? error.message : error}</p>}
      {isSuccess && <p className="p-login-success">{t('login_success')}</p>}
      <div className="div-login-button-wrapper">
        <Button type="submit" disabled={isLoading}>
          {t('login_submit')}
        </Button>
      </div>
    </form>
  )
}