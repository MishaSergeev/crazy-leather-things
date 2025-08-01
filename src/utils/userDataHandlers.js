import { gql } from 'graphql-request';

import { nhost } from '../nhost';
import globalDefaults from '../context/InitialGlobalData';


export const GET_PROFILE = gql`
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
export const GET_CART = gql`
  query GetCart($user_id: uuid!) {
    cart(where: { user_id: { _eq: $user_id } }) {
      item_id
      qty
    }
  }
`;
export const GET_FAVORITES = gql`
  query GetFavorites($user_id: uuid!) {
    favorites(where: { user_id: { _eq: $user_id } }) {
      item_id
    }
  }
`;
export const UPSERT_CART = gql`
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

export async function fetchUserProfile(userId) {
  const { data, error } = await nhost.graphql.request(GET_PROFILE, { id: userId });
  if (error) throw error;
  globalDefaults.User = data?.profiles[0];
}

export async function syncCart(userId, globalData, savedCart) {
  if (!userId) {
    if (Object.keys(savedCart).length > 0) {
      Object.keys(savedCart).forEach((key) => {
        const maxQty = globalData.Items[key].inventory;
        if (globalDefaults.cart[key]) {
          globalDefaults.cart[key].qty = Math.min(
            globalDefaults.cart[key].qty + savedCart[key].qty,
            maxQty
          );
        } else {
          globalDefaults.cart[key] = {
            qty: Math.min(savedCart[key].qty, maxQty),
          };
        }
      });
    }
  } else {
    const { data, error } = await nhost.graphql.request(GET_CART, { user_id: userId });
    if (error) throw error;

    if (data.cart.length > 0) {
      data.cart.forEach((el) => {
        const maxQty = globalData.Items[el.item_id].inventory;
        if (globalDefaults.cart[el.item_id]) {
          globalDefaults.cart[el.item_id].qty = Math.min(
            globalDefaults.cart[el.item_id].qty,
            maxQty
          );
        } else {
          globalDefaults.cart[el.item_id] = {
            qty: Math.min(el.qty, maxQty),
          };
        }
      });
    }
    localStorage.setItem('cart', JSON.stringify(globalDefaults.cart));
  }

  const entries = Object.entries(globalDefaults.cart);
  for (const [item_id, { qty }] of entries) {
    await nhost.graphql.request(UPSERT_CART, {
      user_id: userId,
      item_id,
      qty: Number(qty),
    });
  }
}

export async function syncFavorites(userId) {
  const { data, error } = await nhost.graphql.request(GET_FAVORITES, { user_id: userId });
  if (error) throw error;

  if (data.favorites.length > 0) {
    data.favorites.forEach((el) => {
      globalDefaults.favorite[el.item_id] = { id: el.item_id };
    });
  }
}
