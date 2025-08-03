import { useState, useEffect } from 'react'
import { gql } from "graphql-request";
import { useUserData } from '@nhost/react';
import { useAuthenticationStatus } from '@nhost/react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { nhost } from "../../nhost";
import { useQty } from '../hooks/QtyContext';
import globalDefaults from '../../context/InitialGlobalData';
import User from '../User/User';
import Modal from '../Modal/Modal';

import classes from './ItemFavoriteButton.module.css'
const UPSERT_FAVORITES = gql`
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
const DELETE_FAVORITES_ITEM = gql`
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
export default function ItemFavoriteButton(...props) {
    const { isAuthenticated } = useAuthenticationStatus()
    const user = useUserData()
    const itemId = props[0].data.id;
    const [isModal, setIsModal] = useState(false)
    const handleOpen = () => setIsModal(true);
    const handleClose = () => setIsModal(false);
    const [isMouseOver, setMouseOver] = useState(false)
    const [isAdded, setAdded] = useState(false);
    const { addItemToFavorite } = useQty()
    const favoriteStatus = globalDefaults.favorite[itemId];

    useEffect(() => {
        if (user?.id && favoriteStatus) {
            setAdded(true);
        }
    }, [user, favoriteStatus]);

    const toggleFavorite = async () => {
        if (isAuthenticated && user) {
            if (!globalDefaults.favorite[itemId]) {
                globalDefaults.favorite[itemId] = {
                    id: itemId,
                }
                setAdded(true);
                try {
                    await nhost.graphql.request(UPSERT_FAVORITES, {
                        user_id: user.id,
                        item_id: itemId,
                    })
                } catch (err) {
                    console.error('Favorites GraphQL added error:', err)
                }
            } else {
                delete globalDefaults.favorite[itemId]
                setAdded(false);
                try {
                    await nhost.graphql.request(DELETE_FAVORITES_ITEM, {
                        user_id: user.id,
                        item_id: itemId
                    })
                } catch (err) {
                    console.error('Favorites GraphQL removing error:', err)
                }
            }
            addItemToFavorite()
        } else {
            handleOpen()
        }
    }

    return (
        <>
            <FavoriteBorderIcon
                onMouseOver={() => setMouseOver(true)}
                onMouseOut={() => setMouseOver(false)}
                className={isMouseOver || isAdded ? `${classes['div-item-favorite']} ${classes.focus}` : classes['div-item-favorite']}
                onClick={toggleFavorite} />
            <Modal open={isModal} onClose={handleClose}>
                <User onClose={handleClose} />
            </Modal>
        </>
    )
}