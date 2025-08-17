import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData, useAuthenticationStatus } from "@nhost/react";

import { nhost } from "../../nhost";
import { useGlobalData } from "../../context/GlobalDataContext";
import { useTranslation } from "../../hooks/useTranslation";
import { UPSERT_ITEMS } from "../../graphql/queries";

import FormField from "../FormField/FormField";
import UploadImage from "../UploadImage/UploadImage";
import Button from "../Button/Button";
import Alert from "../Alert/Alert";

import classes from "./UpsertItem.module.css";

export default function UpsertItem({ ...props }) {
  const { globalData } = useGlobalData();
  const navigate = useNavigate();
  const user = useUserData();
  const { isAuthenticated } = useAuthenticationStatus();
  const t = useTranslation();

  const itemFields = {
    id: props.data.id,
    link: props.data.link,
    description: props.data.description,
    description_en: props.data.description_en,
    description_full: props.data.description_full,
    description_full_en: props.data.description_full_en,
    price: props.data.price,
    price_usd: props.data.price_usd,
    inventory: props.data.inventory,
    category: props.data.category,
    category_en: props.data.category_en,
    subcategory: props.data.subcategory,
    subcategory_en: props.data.subcategory_en,
    color: props.data.color,
    color_en: props.data.color_en,
    src: props.data.src,
  };

  const [itemData, setItemData] = useState(itemFields);
  const [imageList, setImageList] = useState(
    props.data.src ? props.data.src.split(",") : []
  );
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user || user.defaultRole !== "admin") return;

    try {
      const src = imageList.join(",");
      const updateRes = await nhost.graphql.request(UPSERT_ITEMS, {
        ...itemData,
        src,
      });

      globalData.Items[itemData.id] = { ...itemData, src };
      console.log("updateRes", updateRes);

      setAlert({ type: "success", message: t("alert_success_changed") });
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      setAlert({ type: "error", message: t("alert_error_changed") });
    }
  };

  return (
    <>
      {user?.defaultRole === "admin" && (
        <div className={classes.div_upsertitem_form}>
          {Object.keys(itemFields).map(
            (key) =>
              key !== "src" && (
                <FormField
                  key={key}
                  label={"add_item_" + key}
                  name={key}
                  value={itemData[key]}
                  onChange={handleChange}
                  type="text"
                  t={t}
                  exception="id"
                />
              )
          )}

          <UploadImage value={imageList} onChange={setImageList} />

          <div className={classes.div_upsertitem_button}>
            <Button onClick={handleSubmit}>Підтвердити зміни</Button>
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