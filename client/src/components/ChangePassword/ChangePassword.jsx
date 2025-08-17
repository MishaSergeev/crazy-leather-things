import { useState } from "react"
import { useChangePassword } from "@nhost/react"

import { useTranslation } from "../../hooks/useTranslation"
import Button from "../Button/Button"
import FormField from "../FormField/FormField"
import classes from "./ChangePassword.module.css"

export default function ChangePassword() {
  const t = useTranslation()
  const { changePassword, isLoading } = useChangePassword()

  const [newPassword, setNewPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    const result = await changePassword(newPassword)

    if (result.error) {
      setErrorMessage(result.error.message)
    } else {
      setSuccessMessage(t("password_changed_success"))
      setNewPassword("")
    }
  }

  return (
    <form className={classes.form_changepassword_container} onSubmit={handleSubmit}>
      <FormField
        key="new_password"
        label="new_password"
        name="new_password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        t={t}
      />
      <div className={classes.div_changepassword_button}>
        <Button type="submit" disabled={isLoading}>
          {t("new_password_submit")}
        </Button>
      </div>
      {errorMessage && (
        <p className={classes.p_changepassword_error}>{errorMessage}</p>
      )}
      {successMessage && (
        <p className={classes.p_changepassword_success}>{successMessage}</p>
      )}
    </form>
  )
}