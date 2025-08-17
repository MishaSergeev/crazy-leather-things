import { useEffect, useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'

import { nhost } from '../../nhost'
import { useTranslation } from '../../hooks/useTranslation'
import { useGlobalData } from '../../context/GlobalDataContext'
import { GET_ORDER_BY_ID } from '../../graphql/queries'
import Loader from '../Loader/Loader'
import Button from '../Button/Button'
import ItemImg from '../ItemImg/ItemImg'

import classes from './OrderDetails.module.css'

export default function OrderDetails() {
  const t = useTranslation()
  const navigate = useNavigate()
  const { globalData } = useGlobalData()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])

  const handleBackClick = () => {
    navigate('/UserPage', { state: { initialTab: 'MyOrders' } })
  }

  useEffect(() => {
    nhost.graphql
      .request(GET_ORDER_BY_ID, { order_number: parseInt(orderId) })
      .then((res) => {
        setOrder(res.data?.orders[0])
        const list = JSON.parse(res.data?.orders[0].items)
        setItems(list)
      })
      .catch(console.error)
  }, [orderId])

  const OrderItemsListTitle = (
    <div className={classes.div_title_order_detailes}>
      <div></div>
      <div>{t('iten_name')}</div>
      <div>{t('iten_qty')}</div>
    </div>
  )

  const OrderItemsList = Object.keys(items).map((key) => (
    <div className={classes.div_items_order_detailes} key={key + 'order-detailes'}>
      <div className={classes.img_item_order_detailes}>
        <ItemImg data={globalData.Items[key]} />
      </div>
      <NavLink
        to={globalData.Items[key].link}
        style={{
          color: '#000000',
          textDecoration: 'none',
        }}
      >
        <div>{globalData.Items[key].description}</div>
      </NavLink>
      <div>{items[key]}</div>
    </div>
  ))

  if (!order) return <Loader />

  return (
    <div className={classes.div_order_detailes}>
      <div className={classes.div_order_detailes_container}>
        <div className={classes.div_order_detailes_info}>
          <h2>
            {t('order_number')} {order.order_number}
          </h2>
          <p>
            {t('order_status')} {order.status}
          </p>
          <p>
            {t('order_date')} {order.date}
          </p>
          <p>
            {t('order_description')} {order.description}
          </p>
          <p>
            {t('sum')} {order.sum}
          </p>
          <Button
            style={{
              border: '1px solid #000000',
            }}
            onClick={handleBackClick}
          >
            {t('back')}
          </Button>
        </div>
        <div className={classes.div_order_detailes_content}>
          {OrderItemsListTitle}
          <div className={classes.div_items_order_detailes_container}>
            <div className={classes.div_items_order_detailes_parent}>{OrderItemsList}</div>
          </div>
        </div>
      </div>
    </div>
  )
}