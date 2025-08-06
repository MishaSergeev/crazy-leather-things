import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useUserData } from '@nhost/react';
import { gql } from 'graphql-request'

import { nhost } from '../../nhost'
import { useGlobalData } from '../../context/GlobalDataContext'
import globalDefaults from "../../context/InitialGlobalData";
import { useQty } from '../../hooks/QtyContext';
import { useTranslation } from '../../hooks/useTranslation';
import { DELIVERY_PROVIDERS } from '../../utils/deliveryProviders'
import FormFieldDropDown from '../FormFieldDropDown/FormFieldDropDown';
import FormField from "../FormField/FormField";
import Button from "../Button/Button"
import Alert from '../Alert/Alert'

import './Submit.css'

const GET_LAST_ORDER_NUMBER = gql`
  query GetLastOrderNumber {
    orders(order_by: { order_number: desc }, limit: 1) {
      order_number
    }
  }
`;

const DELETE_CART_ITEM = gql`
mutation DeleteCartItem($user_id: uuid!, $item_id: String!) {
  delete_cart(
    where: {
      user_id: { _eq: $user_id }
      item_id: { _eq: $item_id }
    }
  ) {
    affected_rows
  }
}
`
const UPSERT_ORDER = gql`
  mutation UpsertOrder(
  $order_number: Int!, 
  $user_id: uuid, 
  $status: String!, 
  $items: String!, 
  $description: String!, 
  $sum: numeric!
  $payment_method: String!,
  $delivery_method: String!,
  $user_name: String!,
  $delivery_email: String!,
  $delivery_phone: String!,
  $delivery_country: String!,
  $delivery_city: String!,
  $delivery_street: String!,
  $delivery_building: String!,
  $delivery_apartment: String!,
  $delivery_zip: String!,
  ) {
    insert_orders(
      objects: {
        order_number: $order_number
        user_id: $user_id
        status: $status
        items: $items
        description: $description
        sum: $sum
        payment_method: $payment_method
        delivery_method: $delivery_method
        user_name: $user_name
        delivery_email: $delivery_email
        delivery_phone: $delivery_phone
        delivery_country: $delivery_country
        delivery_city: $delivery_city
        delivery_street: $delivery_street
        delivery_building: $delivery_building
        delivery_apartment: $delivery_apartment
        delivery_zip: $delivery_zip
      }
    ) {
      affected_rows
    }
  }
`;
export default function Submit() {
  const t = useTranslation()
  const navigate = useNavigate()
  const { addItemToCart } = useQty()
  const { globalData } = useGlobalData()
  const user = useUserData()
  const [alert, setAlert] = useState(null)
  const [showValidation, setShowValidation] = useState(false);
  const [orderDescription, setOrderDescription] = useState('')
  const [deliveryProvider, setDeliveryProvider] = useState('')
  const [deliveryCityQuery, setDeliveryCityQuery] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCityRef, setSelectedCityRef] = useState('')
  const [selectedCityName, setSelectedCityName] = useState('')
  const [branches, setBranches] = useState([])
  const [deliveryBranch, setDeliveryBranch] = useState('')
  const [payment, setPayment] = useState('')
  const deliveryOptions = ["nova_post", "ukrposhta", "ukrposhta_adress", "meest", "other"]
  const paymentOptions = ["payment_cod", "payment_cart", /* "payment_online" */]
  const deliveryAdressFields = {
    user_name: globalDefaults.User.last_name + ' ' + globalDefaults.User.first_name,
    delivery_email: globalDefaults.User.email,
    delivery_phone: globalDefaults.User.phone,
    delivery_country: globalDefaults.User.country,
    delivery_city: globalDefaults.User.city,
    delivery_street: globalDefaults.User.street,
    delivery_building: globalDefaults.User.building,
    delivery_apartment: globalDefaults.User.apartment,
    delivery_zip: globalDefaults.User.zip_code,
  }
  const deliveryUkrpostFields = {
    user_name: '',
    delivery_email: '',
    delivery_phone: '',
    delivery_country: '',
    delivery_city: '',
    delivery_zip: '',
  }
  const [deliveryOrderData, setDeliveryOrderData] = useState(deliveryAdressFields);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryOrderData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!deliveryProvider || !deliveryCityQuery) return

    const provider = DELIVERY_PROVIDERS['nova_post']

    if (!provider?.getCityRequestBody) return

    const body = provider.getCityRequestBody(deliveryCityQuery, provider.apiKey)

    fetch(provider.src, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(json => setCities(provider.parseCities(json)))
      .catch(err => console.error('City request error:', err))

  }, [deliveryCityQuery, deliveryProvider])

  useEffect(() => {
    if (!deliveryProvider || !selectedCityRef) return

    const provider = DELIVERY_PROVIDERS[deliveryProvider]
    const body = {
      apiKey: provider?.apiKey,
      modelName: provider?.branchRequest?.modelName,
      calledMethod: provider?.branchRequest?.calledMethod,
      methodProperties: {
        [provider?.branchRequest?.cityRefKey]: selectedCityRef
      }
    }
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }

    fetch(provider.parseSrc(selectedCityName), request)
      .then(res => res.json())
      .then(response => { response ? setBranches(provider.parseBranches(response)) : console.log('response', response) })
      .then(json => { json ? setBranches(provider.parseBranches(json)) : console.log('json', json) })
      .catch(err => console.error('Branch request error:', err))
  }, [selectedCityRef, selectedCityName, deliveryProvider])

  const RemoveItemsFromCartAndSubmit = async () => {
    if (!deliveryProvider || !payment) {
      setShowValidation(true);
      return setAlert({ type: 'error', message: t('submit_select_all') });
    }
    if ((deliveryProvider === 'nova_post' || deliveryProvider === 'meest') && !deliveryBranch) {
      setShowValidation(true);
      return setAlert({ type: 'error', message: t('submit_select_all') });
    }
    if (deliveryProvider === 'ukrposhta') {
      if (!deliveryOrderData.user_name || !deliveryOrderData.delivery_email || !deliveryOrderData.delivery_phone || !deliveryOrderData.delivery_country || !deliveryOrderData.delivery_city || !deliveryOrderData.delivery_zip) {
        setShowValidation(true);
        return setAlert({ type: 'error', message: t('submit_select_all') });
      }
    }
    if (deliveryProvider === 'ukrposhta_adress') {
      if (!deliveryOrderData.user_name || !deliveryOrderData.delivery_email || !deliveryOrderData.delivery_phone || !deliveryOrderData.delivery_country || !deliveryOrderData.delivery_city || !deliveryOrderData.delivery_street || !deliveryOrderData.delivery_building || !deliveryOrderData.delivery_apartment || !deliveryOrderData.delivery_zip) {
        setShowValidation(true);
        return setAlert({ type: 'error', message: t('submit_select_all') });
      }
    }
    if (deliveryProvider === 'other') {
      if (!deliveryOrderData.user_name || !deliveryOrderData.delivery_email || !deliveryOrderData.delivery_phone) {
        setShowValidation(true);
        return setAlert({ type: 'error', message: t('submit_select_all') });
      }
    }

    let items = {}
    let sum = 0
    for (let key in globalDefaults.cart) {
      items[key] = globalDefaults.cart[key].qty
      sum += globalDefaults.cart[key].qty * globalData.Items[key].price
      if (user) {
        try {
          await nhost.graphql.request(DELETE_CART_ITEM, {
            user_id: user.id,
            item_id: key
          })
        } catch (err) {
          console.error('Cart error:', err)
        }
      }
    }

    const { data } = await nhost.graphql.request(GET_LAST_ORDER_NUMBER);
    const lastNumber = data?.orders?.[0]?.order_number || 0;
    const nextOrderNumber = lastNumber + 1;

    const updateRes = await nhost.graphql.request(UPSERT_ORDER, {
      order_number: nextOrderNumber,
      user_id: user?.id ?? null,
      status: 'Створено',
      items: JSON.stringify(items),
      description: orderDescription,
      sum: sum,
      payment_method: payment,
      delivery_method: deliveryProvider,
      ...deliveryOrderData
    });

    globalDefaults.cart = {};
    addItemToCart()
    if (updateRes.data) {
      setAlert({ type: 'success', message: t('submit_succes_alert') })
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      console.error('Submit error:', updateRes.error)
      setAlert({ type: 'error', message: t('submit_error_alert') });
    }
  }

  return (
    <div className="div-submit-form">
      <h2 className="h2-submit-title">{t('submit_title')}</h2>
      <FormFieldDropDown
        label="delivery_method"
        value={deliveryProvider}
        onChange={e => {
          setDeliveryProvider(e.target.value)
          setDeliveryCityQuery('')
          setCities([])
          setSelectedCityRef('')
          setBranches([])
          setDeliveryBranch('')
        }}
        t={t}
        firstOption={'select_delivery'}
        options={deliveryOptions}
        important={showValidation}
      />

      {(deliveryProvider === 'nova_post' || deliveryProvider === 'meest') && (
        <div className="city-autocomplete-wrapper">
          <FormField
            key="delivery_city"
            label="delivery_city"
            name="delivery_city"
            value={deliveryCityQuery}
            onChange={(e) => {
              setDeliveryCityQuery(e.target.value)
              setSelectedCityRef('')
              setBranches([])
            }}
            type="text"
            t={t}
            important={showValidation}
          />

          {cities.length > 0 && !selectedCityRef && (
            <ul className="autocomplete-dropdown">
              {cities.map((city) => (
                <li
                  key={city.Ref}
                  className="autocomplete-option"
                  onClick={() => {
                    setDeliveryCityQuery(city.Description || city.Present)
                    setSelectedCityRef(city.Ref)
                    setSelectedCityName(city.CityName)
                  }}
                >
                  {city.Description || city.Present}
                </li>
              ))}
            </ul>
          )}

          {branches.length > 0 && selectedCityRef && (
            <FormFieldDropDown
              label="select_branch"
              value={deliveryBranch}
              onChange={(e) => setDeliveryBranch(e.target.value)}
              t={t}
              firstOption={'select_branch'}
              options={branches}
              type='object'
              important={showValidation}
            />
          )}
        </div>
      )}
      {(deliveryProvider === 'ukrposhta_adress') && (
        <>
          {Object.keys(deliveryAdressFields).map((key) => (
            <FormField
              key={key}
              label={"order_" + key}
              name={key}
              value={deliveryOrderData[key]}
              onChange={handleChange}
              type="text"
              t={t}
              important={showValidation}
            />
          ))}
        </>
      )}
      {(deliveryProvider === 'ukrposhta') && (
        <>
          {Object.keys(deliveryUkrpostFields).map((key) => (
            <FormField
              key={key}
              label={"order_" + key}
              name={key}
              value={deliveryOrderData[key]}
              onChange={handleChange}
              type="text"
              t={t}
              important={showValidation}
            />
          ))}
        </>
      )}
      {(deliveryProvider === 'other') && (
        <>
          {Object.keys(deliveryAdressFields).map((key) => (
            <FormField
              key={key}
              label={"order_" + key}
              name={key}
              value={deliveryOrderData[key]}
              onChange={handleChange}
              type="text"
              t={t}
              important={key === 'user_name' || key === 'delivery_email' || key === 'delivery_phone' ? showValidation : null}
            />
          ))}
        </>
      )}
      <FormFieldDropDown
        label="payment_method"
        value={payment}
        onChange={e => setPayment(e.target.value)}
        t={t}
        firstOption={'select_payment'}
        options={paymentOptions}
        important={showValidation}
      />
      <FormField
        key="orderDescription"
        label="order_description"
        name="orderDescription"
        value={orderDescription}
        onChange={e => setOrderDescription(e.target.value)}
        type="text"
        t={t}
      />
      <div className="div-submit-button">
        <Button onClick={RemoveItemsFromCartAndSubmit}>
          {t('submit_order')}
        </Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  )
}