import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { nhost } from '../../nhost';
import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext';
import { GET_ORDER_BY_ID } from '../../graphql/queries';
import ItemImg from '../ItemImg/ItemImg';

import './OrderDetails.css'

export default function OrderDetails() {
    const t = useTranslation();
    const { globalData } = useGlobalData()
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log('orderId', orderId)
        nhost.graphql
            .request(GET_ORDER_BY_ID, { order_number: parseInt(orderId) })
            .then((res) => {
                setOrder(res.data?.orders[0])
                const list = JSON.parse(res.data?.orders[0].items)
                setItems(list)
            })
            .catch(console.error);
    }, [orderId]);
    const OrderItemsListTitle =
        <div className='div-title-order-detailes'>
            <div></div>
            <div>{t('iten_name')}</div>
            <div>{t('iten_qty')} </div>
        </div>
    console.log('items', items)
    const OrderItemsList = Object.keys(items).map((key) => (
        <div className='div-items-order-detailes' key={key + 'order-detailes'}>
            <div className='img-item-order-detailes'>
                <ItemImg data={globalData.Items[key]} />
            </div>
            <NavLink
                to={globalData.Items[key].link}
                style={{
                    color: '#000000',
                    textDecoration: 'none'
                }}
            >
                <div>{globalData.Items[key].description}</div>
            </NavLink>
            <div>{items[key]}</div>
        </div>
    ))


    if (!order) return <p>Завантаження...</p>;

    return (
        <div className='div-order-detailes'>
            <div className="div-order-detailes-info">
                <h2>{t('order_number')} {order.order_number}</h2>
                <p>{t('order_status')} {order.status}</p>
                <p>{t('order_date')} {order.date}</p>
                <p>{t('order_description')} {order.description}</p>
                <p>{t('sum')} {order.sum}</p>

            </div>
            <div className="div-order-detailes-content">
                {OrderItemsListTitle}
                <div className='div-items-order-detailes-container'>
                    <div className='div-items-order-detailes-parent'>
                        {OrderItemsList}
                    </div>
                </div>
            </div>
        </div>
    );
}
