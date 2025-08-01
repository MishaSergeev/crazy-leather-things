import { useState } from 'react'
import { NavLink } from "react-router-dom";
import { useUserData } from '@nhost/react';
import { useAuthenticationStatus } from '@nhost/react'
import EditIcon from '@mui/icons-material/Edit';

import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import globalDefaults from "../../context/InitialGlobalData";
import Comments from "../Comments/Comments";
import ItemCartButton from "../ItemCartButton/ItemCartButton";
import ItemImg from "../ItemImg/ItemImg";
import Button from "../Button/Button";
import AddComment from "../AddComment/AddComment"
import User from "../User/User";
import Modal from '../Modal/Modal';

import "./ItemPage.css"

export default function ItemPage({ ...props }) {
  const t = useTranslation();
  const { language } = useLanguage();
  const user = useUserData()
  const { isAuthenticated } = useAuthenticationStatus();
  const [isModal, setIsModal] = useState(false)
  const handleClose = () => setIsModal(false);
  const handleCartOpen = () => setIsModal(true);

  const modalContext = isAuthenticated && user ?
    <AddComment Item={props.id} onClose={handleClose} /> :
    <User onClose={handleClose} />
  const ItemFileds = [
    { name: t('price'), value: props.data.price + ' ' + globalDefaults.currency[language] },
    { name: t('color'), value: props.data.color },
    { name: t('inventory'), value: props.data.inventory },
  ]

  return (
    <div className='div-item-page'>
      <h2 className='h2-item-page'>{props.data.description}</h2>
      <div className="div-item-parent-page" key={props.id + '-info'}>
        <div className="div-item-page-img">
          <ItemImg data={props.data} />
        </div>
        <div className="div-item-page-info">
          <div className="div-itempage-description">{props.data.description_full}</div>
          <div className="div-item-page-container">
            <div>
              {ItemFileds.map((el) => (
                <div className="div-itempage-attrs-row">
                  <span className="span-itempage-label">{el.name}</span>
                  <span className="span-itempage-value">{el.value}</span>
                </div>
              ))}
            </div>
            <div>
              <NavLink to={props.data.link + '/Upsert'}
                style={{
                  color: '#000000',
                  textDecoration: 'none',
                  padding: '6%',
                }}>
                {user?.defaultRole === 'admin' && (<EditIcon />)}
              </NavLink>
              <ItemCartButton data={props.data} />
            </div>
          </div>
        </div>
      </div>
      <div className="div-item-page-footer">
        <h3 className='h3-item-page'>{t('reviews')} </h3>
        <div className="div-item-page-button-wrapper">
          <Button onClick={handleCartOpen}>{t('new_review')}</Button>
        </div>
      </div>
      <Comments Item={props.id} />
      <Modal open={isModal} onClose={handleClose}>
        {modalContext}
      </Modal>
    </div>
  );
}