import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { useUserData } from '@nhost/react'

import { nhost } from '../../nhost'
import { useTranslation } from '../../hooks/useTranslation'
import { GET_ORDERS } from '../../graphql/queries'

import classes from './Orders.module.css'

export default function Orders() {
  const t = useTranslation()
  const user = useUserData()
  const [ordersData, setOrdersData] = useState([])

  useEffect(() => {
    if (!user) return
    nhost.graphql
      .request(GET_ORDERS, { user_id: user.id })
      .then((res) => {
        const data = res.data?.orders
        if (data) setOrdersData(data)
      })
      .catch(console.error)
  }, [user])

  const OrdersTitleFields = ['№', t('orders_date'), t('orders_sum'), t('orders_status')]

  const OrdersTitle =
    ordersData.length > 0 ? (
      <div className={classes.div_title_orders}>
        {OrdersTitleFields.map((el) => (
          <div key={el}>{el}</div>
        ))}
      </div>
    ) : (
      <></>
    )

  const OrdersList =
    ordersData.length > 0 ? (
      ordersData.map((el) => (
        <div className={classes.div_items_orders} key={el.order_number}>
          <Link to={`/orders/${el.order_number}`} className={classes.order_link}>
            {el.order_number}
          </Link>
          <div>{el.date}</div>
          <div>{el.sum}</div>
          <div>{el.status}</div>
        </div>
      ))
    ) : (
      <div className={classes.div_empty_orders}>{t('orders_empty')}</div>
    )

  return (
    <>
      {OrdersTitle}
      <div className={classes.div_items_orders_container}>
        <div className={classes.div_items_orders_parent}>{OrdersList}</div>
      </div>
    </>
  )
}