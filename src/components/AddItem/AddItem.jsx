import { useEffect, useState } from "react";
import { useUserData, useAuthenticationStatus } from '@nhost/react';
import { useNavigate } from 'react-router-dom';

import { nhost } from '../../nhost';
import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import { UPSERT_ITEMS} from '../../graphql/queries';
import FormField from "../FormField/FormField";
import Alert from '../Alert/Alert'
import UploadImage from '../UploadImage/UploadImage';
import Button from "../Button/Button";

import './AddItem.css';



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
            await nhost.graphql.request(UPSERT_ITEMS, {
                ...ItemData,
                src: src
            });
            globalData.Items[ItemData.id] = {
                ...ItemData,
                src: src
            }
            setAlert({ type: 'success', message: t('alert_success_changed') })
        } catch (error) {
            console.error(t('alert_error_changed'), error);
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