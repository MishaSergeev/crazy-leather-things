import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { gql } from 'graphql-request';

import { nhost } from '../../nhost';
import { useTranslation } from '../hooks/useTranslation';
import globalDefaults from "../../context/InitialGlobalData";
import FormField from "../FormField/FormField";
import Alert from '../Alert/Alert'
import Button from '../Button/Button';
import UploadImage from '../UploadImage/UploadImage';

import './AddCustomOrder.css';

const GET_LAST_ORDER_NUMBER = gql`
  query GetLastCustomOrderNumber {
    custom_order(order_by: { order_number: desc }, limit: 1) {
      order_number
    }
  }
`;

const UPSERT_CUSTOM_ORDER = gql`
  mutation UpsertCustomOrder(
    $order_number: Int!,
    $user_name: String!,
    $email: String!,
    $phone: String!,
    $comment: String!,
    $src: String!
  ) {
    insert_custom_order(
      objects: {
        order_number: $order_number,
        user_name: $user_name,
        email: $email,
        phone: $phone,
        description: $comment,
        src: $src
      }
    ) {
      affected_rows
    }
  }
`;

export default function AddCustomOrder() {
  const t = useTranslation();
  const { setTab } = useOutletContext();
  const fields = {
    user_name: `${globalDefaults.User.last_name} ${globalDefaults.User.first_name}`,
    email: globalDefaults.User.email,
    phone: globalDefaults.User.phone,
    comment: '',
    src: '',
  }
  const [OrderData, setOrderData] = useState(fields);
  const [imageList, setImageList] = useState([]);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const src = imageList.join(",");

      const { data } = await nhost.graphql.request(GET_LAST_ORDER_NUMBER);
      const lastNumber = data?.custom_order?.[0]?.order_number || 0;
      const nextOrderNumber = lastNumber + 1;

      const updateRes = await nhost.graphql.request(UPSERT_CUSTOM_ORDER, {
        order_number: nextOrderNumber,
        ...OrderData,
        src
      });

      if (updateRes.data) {
        setAlert({ type: 'success', message: t('alert_success_order') });
        setTimeout(() => setTab('items'), 1500);
      } else {
        console.error("Помилка при збереженні:", updateRes.error);
        setAlert({ type: 'error', message: t('alert_fail_order') });
      }
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      setAlert({ type: 'error', message: t('alert_error_order') });
    }
  };

  return (
    <div className="div-addcustomorder-form">
      {Object.keys(fields).map((key) => (
        key !== 'src' && <FormField
          key={key}
          label={"custom_order_" + key}
          name={key}
          value={OrderData[key]}
          onChange={handleChange}
          type="text"
          t={t}
        />
      ))}

      <label className="label-addcustomorder-text">{t('custom_order_image')}</label>
      <UploadImage value={imageList} onChange={setImageList} />

      <div className="div-addcustomorder-button">
        <NavLink to="/">
          <Button onClick={handleSubmit}>{t('submit')}</Button>
        </NavLink>
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
