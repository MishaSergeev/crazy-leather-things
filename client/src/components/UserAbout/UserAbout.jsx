import { useEffect, useState } from "react";
import { useUserData } from "@nhost/react";

import { nhost } from "../../nhost";
import { useTranslation } from "../../hooks/useTranslation";
import { GET_PROFILE, INSERT_PROFILE, UPDATE_PROFILE } from "../../graphql/queries";
import FormField from "../FormField/FormField";
import Button from "../Button/Button";
import Alert from "../Alert/Alert";

import classes from "./UserAbout.module.css";

export default function UserAbout() {
  const user = useUserData();
  const t = useTranslation();

  const [alert, setAlert] = useState(null);

  const fields = {
    first_name: "",
    last_name: "",
    birthday: null,
    email: "",
    phone: "",
    about: "",
    country: "",
    city: "",
    street: "",
    building: "",
    apartment: "",
    zip_code: "",
  };

  const [formData, setFormData] = useState(fields);

  useEffect(() => {
    if (!user) return;
    nhost.graphql
      .request(GET_PROFILE, { id: user.id })
      .then((res) => {
        const data = res.data?.profiles[0];
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

      const existingProfile = checkRes.data?.profiles[0];

      if (existingProfile) {
        const updateRes = await nhost.graphql.request(UPDATE_PROFILE, {
          id: user.id,
          data: formData,
        });

        if (updateRes.data) {
          setAlert({ type: "success", message: t("alert_success_user_about") });
        } else {
          setAlert({ type: "error", message: t("alert_fail_user_about") });
        }
      } else {
        const insertRes = await nhost.graphql.request(INSERT_PROFILE, {
          data: profileData,
        });
        if (insertRes.data) {
          setAlert({ type: "success", message: t("alert_success_user_about") });
        } else {
          setAlert({ type: "error", message: t("alert_fail_user_about") });
        }
      }
    } catch (error) {
      console.error("error:", error);
      setAlert({ type: "error", message: t("alert_fail_user_about") });
    }
  };

  const formFields = Object.keys(fields).map((key) => (
    <FormField
      key={key}
      label={"user_" + key}
      name={key}
      value={formData[key]}
      onChange={key === "birthday" ? handleDateChange : handleChange}
      type={key === "birthday" ? "calendar" : "text"}
      t={t}
    />
  ));

  return (
    <form className={classes.form_userabout_form}>
      {formFields}
      <div className={classes.div_userabout_button}>
        <Button
          type="button"
          style={{ border: "1px solid #000000" }}
          onClick={handleSubmit}
        >
          {t("user_about_submit")}
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </form>
  );
}
