import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserData } from '@nhost/react';
import { gql } from 'graphql-request'
import { useAuthenticationStatus } from '@nhost/react'
import CloseIcon from '@mui/icons-material/Close';

import { nhost } from '../../nhost'
import { useQty } from '../hooks/QtyContext';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import globalDefaults from "../../context/InitialGlobalData";
import { useLanguage } from '../../context/LanguageContext';
import ItemCartButton from "../ItemCartButton/ItemCartButton";
import ItemImg from "../ItemImg/ItemImg";

import './Favorites.css'

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
export default function Favorites({ onClose }) {
      const t = useTranslation();
    const { language } = useLanguage();
    const { isAuthenticated } = useAuthenticationStatus()
    const user = useUserData()
    console.log('user', user)
    const [favoriteData, setfavoriteData] = useState({ ...globalDefaults.favorite });
    const { addItemToFavorite } = useQty()
    const { globalData } = useGlobalData()
    const removeItemFromFavorite = async (itemId) => {
        const updatedFavorite = { ...favoriteData };
        delete updatedFavorite[itemId];
        setfavoriteData(updatedFavorite);
        delete globalDefaults.favorite[itemId];
        addItemToFavorite()

        if (isAuthenticated && user) {
            try {
                const { data } = await nhost.graphql.request(DELETE_FAVORITES_ITEM, {
                    user_id: user.id,
                    item_id: itemId
                })
                console.log('Удалено из FAVORITES:', data)
            } catch (err) {
                console.error('Ошибка удаления из FAVORITES:', err)
            }
        }
    }

    const FavoriteTitle = Object.keys(globalDefaults.favorite).length > 0 ?
        <div className='div-title-favorite'>
            <div></div>
            <div>{t('iten_name')}</div>
            <div>{t('iten_price')}</div>
            <div></div>
            <div></div>
        </div> :
        <></>
    const ItemsInFavorite = Object.keys(globalDefaults.favorite).length > 0 ?
        Object.keys(globalDefaults.favorite).map((key) => (
            <div className='div-items-favorite' key={key}>
                <div className='img-item-favorite'>
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
                <div>{globalData.Items[key].price} {globalDefaults.currency[language]}</div>
                <ItemCartButton data={globalData.Items[key]} />
                <CloseIcon onClick={() => removeItemFromFavorite(key)} />
            </div>
        )) :
        <div className='div-empty-favorite'>{t('favorites_empty')}</div>

    return (
        <>
            {FavoriteTitle}
            <div className='div-items-favorite-container'>
                <div className='div-items-favorite-parent'>
                    {ItemsInFavorite}
                </div>
            </div>
        </>
    );
}