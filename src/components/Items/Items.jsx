import { useState } from 'react'
import { NavLink } from "react-router-dom";

import { useLanguage } from '../../context/LanguageContext';
import GlobalData from "../../context/InitialGlobalData";
import ItemImg from "../ItemImg/ItemImg";
import ItemCartButton from "../ItemCartButton/ItemCartButton";

import classes from './Items.module.css'

export default function ItemsGrid({ ...props }) {
  const { language } = useLanguage();
  const [isMouseOver, setMouseOver] = useState(false)

  const filter =
    (props.data.category === props.category || props.category === GlobalData.Categories[language] || !props.category)
    || (props.search
      && props.filter !== ''
      && ((props.data.description || '').toLocaleLowerCase().includes(props.filter.toLocaleLowerCase())
        || (props.data.description_full || '').toLocaleLowerCase().includes(props.filter.toLocaleLowerCase())))

  const listOfItems = (
    (filter) && (
      <div id={props.data.id}
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        className={isMouseOver ? `${classes['div-items-child']} ${classes.focus}` : classes['div-items-child']}
        key={props.data.id}>
        <div className={classes['div-item-container']}>

          <ItemImg data={props.data} />
          <NavLink to={props.data.link}
            style={{
              color: '#000000',
              textDecoration: 'none'
            }}>
            <div className={classes['div-items-description']}>{props.data.description}</div>
          </NavLink>
          <div className={classes['div-item-price-container']}>
            <div className={classes['div-items-price']}>{props.data.price} {GlobalData.currency[language]}</div>
            <ItemCartButton data={props.data} />
          </div>
        </div>
      </div>
    )
  )
  return (
    <>
      {listOfItems}
    </>

  );
}