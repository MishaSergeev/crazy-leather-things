import { useState, useMemo } from 'react'
import { NavLink } from "react-router-dom";
import { useUserData } from '@nhost/react';
import { useAuthenticationStatus } from '@nhost/react'
import EditIcon from '@mui/icons-material/Edit';

import { useTranslation } from '../../hooks/useTranslation';
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

export default function ItemPage({ id, data }) {
  const t = useTranslation();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuthenticationStatus();
  const [isModal, setIsModal] = useState(false)
  const user = useUserData()
  const isAdmin = user?.defaultRole === 'admin';

  const handleClose = () => setIsModal(false);
  const handleCartOpen = () => setIsModal(true);

  const modalContext = isAuthenticated && user ?
    <AddComment Item={id} onClose={handleClose} /> :
    <User onClose={handleClose} />

  const itemFields = useMemo(() => [
    { name: t('price'), value: `${data.price} ${globalDefaults.currency[language]}` },
    { name: t('color'), value: data.color },
    { name: t('inventory'), value: data.inventory },
  ], [t, data, language]);

  return (
    <div className='div-item-page'>
      <h2 className='h2-item-page'>{data.description}</h2>
      <div className="div-item-parent-page">
        <div className="div-item-page-img">
          <ItemImg data={data} />
        </div>
        <div className="div-item-page-info">
          <div className="div-itempage-description">{data.description_full}</div>
          <div className="div-item-page-container">
            <div>
              {itemFields.map((el) => (
                <div className="div-itempage-attrs-row" key={id + '-info-' + el.name}>
                  <span className="span-itempage-label">{el.name}</span>
                  <span className="span-itempage-value">{el.value}</span>
                </div>
              ))}
            </div>
            <div>
              <NavLink to={data.link + '/Upsert'}
                style={{
                  color: '#000000',
                  textDecoration: 'none',
                  padding: '6%',
                }}>
                {isAdmin && (<EditIcon />)}
              </NavLink>
              <ItemCartButton data={data} />
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
      <Comments Item={id} />
      <Modal open={isModal} onClose={handleClose} isLogin={true}>
        {modalContext}
      </Modal>
    </div>
  );
}