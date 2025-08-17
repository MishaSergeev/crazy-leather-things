import { useState } from "react";
import { NavLink, useOutletContext } from "react-router-dom";

import { nhost } from "../../nhost";
import { useTranslation } from "../../hooks/useTranslation";
import { GET_LAST_CUSTOM_ORDER_NUMBER, UPSERT_CUSTOM_ORDER } from "../../graphql/queries";
import { sendEmail } from "../../utils/sendEmail";
import { useGlobalData } from "../../context/GlobalDataContext";
import { useLanguage } from "../../context/LanguageContext";
import globalDefaults from "../../context/InitialGlobalData";

import FormField from "../FormField/FormField";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import UploadImage from "../UploadImage/UploadImage";

import classes from "./AddCustomOrder.module.css";

export default function AddCustomOrder() {
  // hooks
  const t = useTranslation();
  const { globalData } = useGlobalData();
  const { language } = useLanguage();
  const { setTab } = useOutletContext();

  // derived
  const currency = globalDefaults.currency[language];

  // state
  const [showValidation, setShowValidation] = useState(false);
  const fields = {
    user_name: `${globalDefaults.User.last_name} ${globalDefaults.User.first_name}`,
    delivery_email: globalDefaults.User.email,
    delivery_phone: globalDefaults.User.phone,
    comment: "",
    delivery_connection: "",
    src: "",
  };
  const [OrderData, setOrderData] = useState(fields);
  const [imageList, setImageList] = useState([]);
  const [alert, setAlert] = useState(null);

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !OrderData.user_name ||
        !OrderData.delivery_email ||
        !OrderData.delivery_phone ||
        !OrderData.comment
      ) {
        setShowValidation(true);
        setAlert({ type: "error", message: t("submit_select_all") });
        return;
      }

      const src = imageList.join(",");

      const { data } = await nhost.graphql.request(GET_LAST_CUSTOM_ORDER_NUMBER);
      const lastNumber = data?.custom_order?.[0]?.order_number || 0;
      const nextOrderNumber = lastNumber + 1;

      const dataForUpdate = {
        order_number: nextOrderNumber,
        ...OrderData,
        src,
      };

      const updateRes = await nhost.graphql.request(UPSERT_CUSTOM_ORDER, dataForUpdate);

      if (updateRes.data) {
        sendEmail(
          "crazyleatherthing@gmail.com",
          "You have new custom order",
          dataForUpdate,
          "CustomOrder",
          "admin",
          t,
          currency,
          globalData
        );
        sendEmail(
          OrderData.delivery_email,
          t("email_custom_order"),
          dataForUpdate,
          "CustomOrder",
          "customer",
          t,
          currency,
          globalData
        );
        setAlert({ type: "success", message: t("alert_success_order") });
        setTimeout(() => setTab("items"), 1500);
      } else {
        console.error("Saved update error:", updateRes.error);
        setAlert({ type: "error", message: t("alert_fail_order") });
      }
    } catch (error) {
      console.error("Saved error:", error);
      setAlert({ type: "error", message: t("alert_error_order") });
    }
  };

  // render
  return (
    <div className={classes.div_addcustomorder_form}>
      {Object.keys(fields).map(
        (key) =>
          key !== "src" && (
            <FormField
              key={key}
              label={"custom_order_" + key}
              name={key}
              value={OrderData[key]}
              onChange={handleChange}
              type={key === "delivery_email" ? "email" : key === "delivery_phone" ? "tel" : "text"}
              t={t}
              important={key === "delivery_connection" || key === "src" ? null : showValidation}
            />
          )
      )}

      <UploadImage value={imageList} onChange={setImageList} label={t("custom_order_image")} />

      <div className={classes.div_addcustomorder_button}>
        <NavLink to="/">
          <Button
            style={{
              border: "1px solid #000000",
            }}
            onClick={handleSubmit}
          >
            {t("submit")}
          </Button>
        </NavLink>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}
    </div>
  );
}
