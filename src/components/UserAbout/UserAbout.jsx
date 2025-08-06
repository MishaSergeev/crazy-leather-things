import { useEffect, useState } from "react";
import { useUserData } from '@nhost/react';
import { gql } from "graphql-request";

import { nhost } from "../../nhost";
import { useTranslation } from '../../hooks/useTranslation';
import FormField from "../FormField/FormField";
import Button from "../Button/Button";
import Alert from '../Alert/Alert';

import './UserAbout.css'

const GET_PROFILE = gql`
  query GetProfile($id: uuid!) {
    profiles_by_pk(id: $id) {
      id
      first_name
      last_name
      birthday
      email
      phone
      about
      country
      city
      street
      building
      apartment
      zip_code
    }
  }
`;

const INSERT_PROFILE = gql`
  mutation InsertProfile($data: profiles_insert_input!) {
    insert_profiles_one(object: $data) {
      id
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: uuid!, $data: profiles_set_input!) {
    update_profiles_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`;


export default function UserAbout() {
  const [alert, setAlert] = useState(null)
  const user = useUserData();
  const fields = {
    first_name: "",
    last_name: "",
    birthday: "",
    email: "",
    phone: "",
    about: "",
    country: "",
    city: "",
    street: "",
    building: "",
    apartment: "",
    zip_code: "",
  }
  const [formData, setFormData] = useState(fields);
  const t = useTranslation();

  useEffect(() => {
    if (!user) return;

    nhost.graphql
      .request(GET_PROFILE, { id: user.id })
      .then((res) => {
        const data = res.data?.profiles_by_pk;
        if (data) setFormData((prev) => ({ ...prev, ...data }));
      })
      .catch(console.error);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birthday: date }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const profileData = {
      ...formData,
      id: user.id,
    };

    try {
      const checkRes = await nhost.graphql.request(GET_PROFILE, {
        id: user.id,
      });

      const existingProfile = checkRes.data?.profiles_by_pk;

      if (existingProfile) {
        const updateRes = await nhost.graphql.request(UPDATE_PROFILE, {
          id: user.id,
          data: formData,
        });
        if (updateRes.data) {
          setAlert({ type: 'success', message: t('alert_success_user_about') })
        } else {
          setAlert({ type: 'error', message: t('alert_fail_user_about') });
        }
      } else {
        const insertRes = await nhost.graphql.request(INSERT_PROFILE, {
          data: profileData,
        });
        if (insertRes.data) {
          setAlert({ type: 'success', message: t('alert_success_user_about') })
        } else {
          setAlert({ type: 'error', message: t('alert_fail_user_about') });
        }
      }
    } catch (error) {
      console.error("error:", error);
      setAlert({ type: 'error', message: t('alert_fail_user_about') });
    }
  };

  const formField = Object.keys(fields).map((key) => (
    <FormField
      key={key}
      label={"user_" + key}
      name={key}
      value={formData[key]}
      onChange={key === "birthday" ? handleDateChange : handleChange}
      type={key === "birthday" ? "calendar" : "text"}
      t={t}
    />
  ))
  return (
    <>
      <form className="form-userabout-form">
        {formField}
        <div className="div-userabout-button">
          <Button onClick={handleSubmit}>{t('user_about_submit')}</Button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </form>
    </>
  );
}
