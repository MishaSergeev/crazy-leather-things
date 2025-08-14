import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUserData } from '@nhost/react';

import { nhost } from '../../nhost'
import { useTranslation } from '../../hooks/useTranslation';
import { GET_ORDERS } from '../../graphql/queries';

import './Orders.css'

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
                if (data) setOrdersData(data);
            })
            .catch(console.error);
    }, [user]);
    const OrdersTitleFileds = ['№', t('orders_date'), t('orders_sum'), t('orders_status')]
    const OrdersTitle = ordersData.length > 0 ?
        <div className='div-title-orders'>
            {OrdersTitleFileds.map((el) => (
                <div key={el}>{el}</div>
            ))}
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