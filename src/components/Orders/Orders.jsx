import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUserData } from '@nhost/react';
import { gql } from 'graphql-request'


import { nhost } from '../../nhost'
import { useTranslation } from '../hooks/useTranslation';

import './Orders.css'

const GET_ORDERS = gql`
  query GetOrders($user_id: uuid!) {
    orders(where: { user_id: { _eq: $user_id } }) {
      order_number
      status
      items
      date
      description
      payment_method
      delivery_method
      delivery_email
      delivery_phone
      delivery_country
      delivery_city
      delivery_street
      delivery_building
      delivery_apartment
      delivery_zip
      sum
    }
  }
`;
export default function Orders() {
    const t = useTranslation();
    const user = useUserData()
    const [ordersData, setOrdersData] = useState([]);
    useEffect(() => {
        if (!user) return;
        nhost.graphql
            .request(GET_ORDERS, { user_id: user.id })
            .then((res) => {
                const data = res.data?.orders;
                console.log('res', res)
                if (data) setOrdersData(data);
            })
            .catch(console.error);
    }, [user]);


    const OrdersTitle = ordersData.length > 0 ?
        <div className='div-title-orders'>
            <div>№</div>
            <div>{t('orders_date')}</div>
            <div>{t('orders_sum')}</div>
            <div>{t('orders_status')}</div>
        </div> :
        <></>

    const Orders = ordersData.length > 0
        ? ordersData.map((el) => (
            <div className='div-items-orders' key={el.order_number}>
                <Link to={`/orders/${el.order_number}`} className='order-link'>
                    {el.order_number}
                </Link>
                <div>{el.date}</div>
                <div>{el.sum}</div>
                <div>{el.status}</div>
            </div>
        ))
        : <div className='div-empty-orders'>{t('orders_empty')}</div>;


    return (
        <>
            {OrdersTitle}
            <div className='div-items-orders-container'>
                <div className='div-items-orders-parent'>
                    {Orders}
                </div>
            </div>
        </>
    );
}