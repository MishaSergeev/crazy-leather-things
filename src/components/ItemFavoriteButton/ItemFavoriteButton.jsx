import { useState, useEffect } from 'react'
import { gql } from "graphql-request";
import { useUserData } from '@nhost/react';
import { useAuthenticationStatus } from '@nhost/react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { nhost } from "../../nhost";
import { useQty } from '../hooks/QtyContext';
import GlobalData from '../../context/InitialGlobalData';
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
export default function ItemFavoriteButton(...props) {
    const { isAuthenticated } = useAuthenticationStatus()
    const user = useUserData()
    const itemId = props[0].data.id;
    const [isModal, setIsModal] = useState(false)
    const handleOpen = () => setIsModal(true);
    const handleClose = () => setIsModal(false);
    const [isMouseOver, setMouseOver] = useState(false)
    const [isAdded, setAdded] = useState(() => {
        return GlobalData.favorite[itemId]?.isAdded || false;
    });
    const { addItemToFavorite } = useQty()
    const addToFavoruteButton = async () => {
        if (isAuthenticated && user) {
            GlobalData.favorite[itemId] = {
                id: itemId,
            }
            setAdded(true);
            addItemToFavorite()
            try {
                await nhost.graphql.request(UPSERT_FAVORITES, {
                    user_id: user.id,
                    item_id: itemId,
                })
            } catch (err) {
                console.error('Favorites GraphQL error:', err)
            }
        } else {
            handleOpen()
        }
    }
    useEffect(() => {
        setAdded(GlobalData.favorite[itemId] || false);
    }, [itemId]);
    return (
        <>
            <FavoriteBorderIcon
                onMouseOver={() => setMouseOver(true)}
                onMouseOut={() => setMouseOver(false)}
                className={isMouseOver || isAdded ? `${classes['div-item-favorite']} ${classes.focus}` : classes['div-item-favorite']}
                onClick={addToFavoruteButton} />
            <Modal open={isModal} onClose={handleClose}>
                <User onClose={handleClose} />
            </Modal>
        </>
    )
}