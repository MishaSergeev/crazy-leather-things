import { gql } from '@apollo/client';

export const GET_GLOBAL_DATA = gql`
  query {
    slides_images {
      key
      src
    }
    slides_images_about {
      key
      src
    }
    tabs_section {
      id
      desc
      desc_en
    }
    tabs_section_user {
      id
      desc
      desc_en
    }
    user_tabs {
      id
      desc
      desc_en
    }
    categories {
      name_en
      name_ukr
    }
    items {
      id
      link
      description
      description_en
      description_full
      description_full_en
      price
      price_usd
      inventory
      category
      category_en
      subcategory
      subcategory_en
      color
      color_en
      date
      src
    }
  }
`;

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

export const GET_LAST_COMMENT_NUMBER = gql`
  query GetLastOrderNumber {
    comments(order_by: { id: desc }, limit: 1) {
      id
    }
  }
`;
export const UPSERT_COMMENTS = gql`
  mutation UpsertComment(
    $id: Int!,
    $user_id: uuid!,
    $item_id: String!,
    $user_name: String!,
    $comment: String!,
    $src: String!
) {
    insert_comments(
      objects: {
        id: $id
        user_id: $user_id
        item_id: $item_id
        user_name: $user_name
        comment: $comment
        src: $src
      }
    ) {
      affected_rows
    }
  }
`;
export const GET_LAST_ORDER_NUMBER = gql`
  query GetLastCustomOrderNumber {
    custom_order(order_by: { order_number: desc }, limit: 1) {
      order_number
    }
  }
`;

export const UPSERT_CUSTOM_ORDER = gql`
  mutation UpsertCustomOrder(
    $order_number: Int!,
    $user_name: String!,
    $email: String!,
    $phone: String!,
    $comment: String!,
    $src: String!
  ) {
    insert_custom_order(
      objects: {
        order_number: $order_number,
        user_name: $user_name,
        email: $email,
        phone: $phone,
        description: $comment,
        src: $src
      }
    ) {
      affected_rows
    }
  }
`;

export const UPSERT_ITEMS = gql`
  mutation UpsertItems(
    $id: String!,
    $link: String!,
    $description: String!,
    $description_en: String!,
    $description_full: String!,
    $description_full_en: String!,
    $price: numeric!,
    $price_usd: numeric!,
    $inventory: numeric!,
    $category: String!,
    $category_en: String!,
    $subcategory: String!,
    $subcategory_en: String!,
    $color: String!,
    $color_en: String!,
    $src: String!
  ) {
    insert_items(
      objects: {
        id: $id,
        link: $link,
        description: $description,
        description_en: $description_en,
        description_full: $description_full,
        description_full_en: $description_full_en,
        price: $price,
        price_usd: $price_usd,
        inventory: $inventory,
        category: $category,
        category_en: $category_en,
        subcategory: $subcategory,
        subcategory_en: $subcategory_en,
        color: $color,
        color_en: $color_en,
        src: $src
      },
      on_conflict: {
        constraint: items_pkey,
        update_columns: [
          link,
          description,
          description_en,
          description_full,
          description_full_en,
          price,
          inventory,
          category,
          category_en,
          subcategory,
          subcategory_en,
          color,
          color_en,
          src
        ]
      }
    ) {
      affected_rows
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

export const DELETE_CART_ITEM = gql`
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

export const GET_COMMENTS_DATA = gql`
  query{
    comments(
    limit: 10
    order_by: { date: desc }
    ) {
      id
      item_id
      user_name
      date
      comment
      src
    }
  }
`;

export const GET_COMMENTS_DATA_BY_ID = gql`
  query ($item_id: String) {
    comments(
    where: { item_id: { _eq: $item_id } }
    limit: 10
    order_by: { date: desc }
    ) {
      id
      item_id
      user_name
      date
      comment
      src
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

export const DELETE_FAVORITES_ITEM = gql`
mutation DeleteCartItem($user_id: uuid!, $item_id: String!) {
  delete_favorites(
    where: {
      user_id: { _eq: $user_id }
      item_id: { _eq: $item_id }
    }
  ) {
    affected_rows
  }
}
`
export const UPSERT_FAVORITES = gql`
  mutation UpsertFavorites($item_id: String!, $user_id: uuid!) {
    insert_favorites(
      objects: {
        item_id: $item_id
        user_id: $user_id
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrder($order_number: Int!) {
  orders(where: { order_number: { _eq: $order_number } }){
      order_number
      status
      items
      date
      description
      sum
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($user_id: uuid!) {
    orders(where: { user_id: { _eq: $user_id } }) {
      order_number
      status
      items
      date
      description
      payment_method
      delivery_method
      delivery_email
      delivery_phone
      delivery_country
      delivery_city
      delivery_street
      delivery_building
      delivery_apartment
      delivery_zip
      sum
    }
  }
`;