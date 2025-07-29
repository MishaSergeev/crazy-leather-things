import { useEffect, useState } from "react";
import { useUserData, useAuthenticationStatus } from '@nhost/react';
import { useNavigate } from 'react-router-dom';
import { gql } from 'graphql-request';

import { nhost } from '../../nhost';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import FormField from "../FormField/FormField";
import Alert from '../Alert/Alert'
import UploadImage from '../UploadImage/UploadImage';
import Button from "../Button/Button";

import './AddItem.css';

const UPSERT_ITEMS = gql`
  mutation UpsertItems(
    $id: String!,
    $link: String!,
    $description: String!,
    $description_en: String!,
    $description_full: String!,
    $description_full_en: String!,
    $price: numeric!,
    $price_usd: numeric!,
    $inventory: numeric!,
    $category: String!,
    $category_en: String!,
    $subcategory: String!,
    $subcategory_en: String!,
    $color: String!,
    $color_en: String!,
    $src: String!
  ) {
    insert_items(
      objects: {
        id: $id,
        link: $link,
        description: $description,
        description_en: $description_en,
        description_full: $description_full,
        description_full_en: $description_full_en,
        price: $price,
        price_usd: $price_usd,
        inventory: $inventory,
        category: $category,
        category_en: $category_en,
        subcategory: $subcategory,
        subcategory_en: $subcategory_en,
        color: $color,
        color_en: $color_en,
        src: $src
      },
      on_conflict: {
        constraint: items_pkey,
        update_columns: [
          link,
          description,
          description_en,
          description_full,
          description_full_en,
          price,
          inventory,
          category,
          category_en,
          subcategory,
          subcategory_en,
          color,
          color_en,
          src
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export default function AddItem() {
    const { globalData } = useGlobalData()
    const navigate = useNavigate();
    const user = useUserData();
    const { isAuthenticated } = useAuthenticationStatus();
    const [alert, setAlert] = useState(null)
    const t = useTranslation();
    const itemFields = {
        id: '',
        link: '/',
        description: '',
        description_en: '',
        description_full: '',
        description_full_en: '',
        price: 0,
        price_usd: 0,
        inventory: 0,
        category: '',
        category_en: '',
        subcategory: '',
        subcategory_en: '',
        color: '',
        color_en: '',
        src: '',
    }
    const [ItemData, setItemData] = useState(itemFields);

    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!user || user.defaultRole !== 'admin') return;

        try {
            const src = imageList.join(",")
            const updateRes = await nhost.graphql.request(UPSERT_ITEMS, {
                ...ItemData,
                src: src
            });
            globalData.Items[ItemData.id] = {
                ...ItemData,
                src: src
            }
            console.log('updateRes', updateRes)
            setAlert({ type: 'success', message: t('alert_success_changed') })
        } catch (error) {
            console.error("Помилка при збереженні:", error);
            setAlert({ type: 'error', message: t('alert_error_changed') })
        }
    };
    

    return (
        <>
            {user?.defaultRole === 'admin' && (
                <div className="div-additem-form">
                    {Object.keys(itemFields).map((key) => (
                        key !== 'src' && <FormField
                            key={key}
                            label={"add_item_" + key}
                            name={key}
                            value={ItemData[key]}
                            onChange={handleChange}
                            type="text"
                            t={t}
                        />
                    ))}

                    <UploadImage value={imageList} onChange={setImageList} />

                    <div className="div-additem-button">
                        <Button onClick={handleSubmit}>{t('submit_chages')}</Button>
                    </div>

                    {alert && (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}
                </div>
            )}
        </>
    );
}