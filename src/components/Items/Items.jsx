import { useState } from 'react';
import { NavLink } from "react-router-dom";

import { useLanguage } from '../../context/LanguageContext';
import GlobalData from "../../context/InitialGlobalData";
import ItemImg from "../ItemImg/ItemImg";
import ItemCartButton from "../ItemCartButton/ItemCartButton";

import classes from './Items.module.css';

export default function ItemsGrid({ data }) {
  const { language } = useLanguage();
  const [isMouseOver, setMouseOver] = useState(false);

  return (
    <div
      id={data.id}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      className={isMouseOver ? `${classes['div-items-child']} ${classes.focus}` : classes['div-items-child']}
    >
      <div className={classes['div-item-container']}>
        <ItemImg data={data} />
        <NavLink to={data.link} className={classes['item-link']}>
          <div className={classes['div-items-description']}>{data.description}</div>
        </NavLink>
        <div className={classes['div-item-price-container']}>
          <div className={classes['div-items-price']}>
            {data.price} {GlobalData.currency[language]}
          </div>
          <ItemCartButton data={data} />
        </div>
      </div>
    </div>
  );
}
