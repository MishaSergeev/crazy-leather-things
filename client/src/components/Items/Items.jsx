import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useLanguage } from '../../context/LanguageContext'
import GlobalData from '../../context/InitialGlobalData'
import ItemImg from '../ItemImg/ItemImg'
import ItemCartButton from '../ItemCartButton/ItemCartButton'

import classes from './Items.module.css'
import clsx from 'clsx'

export default function ItemsGrid({ data }) {
  const { language } = useLanguage()
  const [isMouseOver, setMouseOver] = useState(false)

  return (
    <div
      id={data.id}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      className={clsx(classes.div_items_child, {
        [classes.focus]: isMouseOver
      })}
    >
      <div className={classes.div_item_container}>
        <ItemImg data={data} />
        <NavLink to={data.link} className={classes.item_link}>
          <div className={classes.div_items_description}>
            {data.description}
          </div>
        </NavLink>
        <div className={classes.div_item_price_container}>
          <div className={classes.div_items_price}>
            {data.price} {GlobalData.currency[language]}
          </div>
          <ItemCartButton data={data} />
        </div>
      </div>
    </div>
  )
}