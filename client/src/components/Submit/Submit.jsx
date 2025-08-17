import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserData } from '@nhost/react';

import { nhost } from '../../nhost';
import { useQty } from '../../hooks/QtyContext';
import { useTranslation } from '../../hooks/useTranslation';
import { roundToTwo } from '../../utils/round';
import { DELIVERY_PROVIDERS } from '../../utils/deliveryProviders';
import { sendEmail } from "../../utils/sendEmail";
import { syncCart } from '../../utils/userDataHandlers';
import { useGlobalData } from '../../context/GlobalDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { GET_LAST_ORDER_NUMBER, DELETE_CART_ITEM, UPSERT_ORDER } from '../../graphql/queries';
import globalDefaults from "../../context/InitialGlobalData";

import FormFieldDropDown from '../FormFieldDropDown/FormFieldDropDown';
import FormField from "../FormField/FormField";
import Button from "../Button/Button";
import Alert from '../Alert/Alert';

import classes from './Submit.module.css';

export default function Submit() {
  const t = useTranslation();
  const { language } = useLanguage();
  const currency = globalDefaults.currency[language];
  const navigate = useNavigate();
  const { addItemToCart } = useQty();
  const { globalData } = useGlobalData();
  const user = useUserData();

  const [alert, setAlert] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [orderDescription, setOrderDescription] = useState('');
  const [deliveryProvider, setDeliveryProvider] = useState('');
  const [deliveryCityQuery, setDeliveryCityQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCityRef, setSelectedCityRef] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [branches, setBranches] = useState([]);
  const [deliveryBranch, setDeliveryBranch] = useState('');
  const [payment, setPayment] = useState('');

  const deliveryOptions = ["nova_post", "ukrposhta", "ukrposhta_adress", "meest", "other"];
  const paymentOptions = ["payment_cod", "payment_cart" /* , "payment_online" */];

  const defaultFields = {
    user_name: globalDefaults.User.last_name + ' ' + globalDefaults.User.first_name,
    delivery_email: globalDefaults.User.email,
    delivery_phone: globalDefaults.User.phone,
    delivery_connection: '',
  };

  const deliveryAdressFields = {
    delivery_country: globalDefaults.User.country,
    delivery_city: globalDefaults.User.city,
    delivery_street: globalDefaults.User.street,
    delivery_building: globalDefaults.User.building,
    delivery_apartment: globalDefaults.User.apartment,
    delivery_zip: globalDefaults.User.zip_code,
  };

  const deliveryUkrpostFields = {
    delivery_country: '',
    delivery_city: '',
    delivery_zip: '',
  };

  const [deliveryOrderData, setDeliveryOrderData] = useState({ ...defaultFields, ...deliveryAdressFields });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const RemoveItemsFromCartAndSubmit = async () => {
    if (!deliveryOrderData.user_name || !deliveryOrderData.delivery_email || !deliveryOrderData.delivery_phone) {
      setShowValidation(true);
      return setAlert({ type: 'error', message: t('submit_select_all') });
    }
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

    let items = {};
    const TotalSum = roundToTwo(
      Object.entries(globalDefaults.cart).reduce((sum, [key, item]) => {
        items[key] = globalDefaults.cart[key].qty;
        const qty = item?.qty || 0;
        const price = globalData.Items[key]?.price || 0;
        return sum + qty * price;
      }, 0)
    );

    const { data } = await nhost.graphql.request(GET_LAST_ORDER_NUMBER);
    const lastNumber = data?.orders?.[0]?.order_number || 0;
    const nextOrderNumber = lastNumber + 1;

    const dataForUpdate = {
      order_number: nextOrderNumber,
      user_id: user?.id ?? null,
      status: 'Створено',
      items: JSON.stringify(items),
      description: orderDescription,
      sum: TotalSum,
      payment_method: payment,
      delivery_method: deliveryProvider,
      delivery_branch: deliveryBranch,
      ...deliveryOrderData
    };

    const updateRes = await nhost.graphql.request(UPSERT_ORDER, dataForUpdate);

    if (updateRes.data) {
      for (let key in globalDefaults.cart) {
        if (user) {
          try {
            await nhost.graphql.request(DELETE_CART_ITEM, {
              user_id: user.id,
              item_id: key
            });
          } catch (err) {
            console.error('Cart error:', err);
          }
        }
      }
      globalDefaults.cart = {};
      await syncCart(null, globalData, {});
      addItemToCart();
      sendEmail('crazyleatherthing@gmail.com', 'You have new order', dataForUpdate, 'Order', 'admin', t, currency, globalData);
      sendEmail(dataForUpdate.delivery_email, t('email_order'), dataForUpdate, 'Order', 'customer', t, currency, globalData);
      setAlert({ type: 'success', message: t('submit_succes_alert') });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      console.error('Submit error:', updateRes.error);
      setAlert({ type: 'error', message: t('submit_error_alert') });
    }
  };

  useEffect(() => {
    if (!deliveryProvider || !deliveryCityQuery) return;

    const provider = DELIVERY_PROVIDERS['nova_post'];
    if (!provider?.getCityRequestBody) return;

    const body = provider.getCityRequestBody(deliveryCityQuery, provider.apiKey);

    fetch(provider.src, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(json => setCities(provider.parseCities(json)))
      .catch(err => console.error('City request error:', err));
  }, [deliveryCityQuery, deliveryProvider]);

  useEffect(() => {
    if (!deliveryProvider || !selectedCityRef) return;

    const provider = DELIVERY_PROVIDERS[deliveryProvider];
    const body = {
      apiKey: provider?.apiKey,
      modelName: provider?.branchRequest?.modelName,
      calledMethod: provider?.branchRequest?.calledMethod,
      methodProperties: {
        [provider?.branchRequest?.cityRefKey]: selectedCityRef
      }
    };

    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };

    fetch(provider.parseSrc(selectedCityName), request)
      .then(res => res.json())
      .then(response => { response ? setBranches(provider.parseBranches(response)) : console.log('response', response); })
      .catch(err => console.error('Branch request error:', err));
  }, [selectedCityRef, selectedCityName, deliveryProvider]);

  return (
    <div className={classes.div_submit_form}>
      <h2 className={classes.h2_submit_title}>{t('submit_title')}</h2>

      {Object.keys(defaultFields).map((key) => (
        <FormField
          key={key}
          label={"order_" + key}
          name={key}
          value={deliveryOrderData[key]}
          onChange={handleChange}
          type="text"
          t={t}
          important={key !== 'delivery_connection' ? showValidation : null}
        />
      ))}

      <FormFieldDropDown
        label="delivery_method"
        value={deliveryProvider}
        onChange={e => {
          setDeliveryProvider(e.target.value);
          setDeliveryCityQuery('');
          setCities([]);
          setSelectedCityRef('');
          setBranches([]);
          setDeliveryBranch('');
        }}
        t={t}
        firstOption={'select_delivery'}
        options={deliveryOptions}
        important={showValidation}
      />

      {(deliveryProvider === 'nova_post' || deliveryProvider === 'meest') && (
        <>
          <div className={classes.city_autocomplete_wrapper}>
            <FormField
              key="delivery_city"
              label="delivery_city"
              name="delivery_city"
              value={deliveryCityQuery}
              onChange={(e) => {
                setDeliveryCityQuery(e.target.value);
                setSelectedCityRef('');
                setBranches([]);
              }}
              type="text"
              t={t}
              important={showValidation}
            />

            {cities.length > 0 && !selectedCityRef && (
              <ul className={classes.autocomplete_dropdown}>
                {cities.map((city) => (
                  <li
                    key={city.Ref}
                    className={classes.autocomplete_option}
                    onClick={() => {
                      setDeliveryCityQuery(city.Description || city.Present);
                      setSelectedCityRef(city.Ref);
                      setSelectedCityName(city.CityName);
                    }}
                  >
                    {city.Description || city.Present}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {branches.length > 0 && selectedCityRef && (
            <FormFieldDropDown
              label="select_branch"
              value={deliveryBranch}
              onChange={(e) => setDeliveryBranch(e.target.value)}
              t={t}
              firstOption={'select_branch'}
              options={branches}
              type='object'
              isInput={true}
              important={showValidation}
            />
          )}
        </>
      )}

      {deliveryProvider === 'ukrposhta_adress' && (
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

      {deliveryProvider === 'ukrposhta' && (
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

      {deliveryProvider === 'other' && (
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

      <div className={classes.div_submit_button}>
        <Button onClick={RemoveItemsFromCartAndSubmit}>
          {t('submit_order')}
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}