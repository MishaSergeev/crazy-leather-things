import { SiInstagram, SiEtsy } from "react-icons/si"
import { Facebook } from "@mui/icons-material"

import { useTranslation } from "../../hooks/useTranslation"

import classes from "./Contacts.module.css"

export default function Contacts() {
  const t = useTranslation()

  return (
    <div className={classes.div_contacts_container}>
      <img
        src="https://ydlylvuihkcjzlsgityq.storage.eu-west-2.nhost.run/v1/files/39e24b73-3213-4727-aa88-60277170afdb"
        alt="Olga"
        className={classes.img_contacts_photo}
      />

      <h2 className={classes.h2_contacts_name}>{t("contacts_name")}</h2>
      <p className={classes.p_contacts_role}>{t("contacts_role")}</p>
      <p className={classes.p_contacts_description}>{t("contacts_description")}</p>

      <div className={classes.div_contacts_links}>
        <a
          href="https://www.instagram.com/crazy_leather_things/"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.a_contacts_link}
        >
          <SiInstagram className={classes.icon_contacts_social} />
          Instagram
        </a>

        <a
          href="https://www.facebook.com/CrazyLeatherThings/"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.a_contacts_link}
        >
          <Facebook className={classes.icon_contacts_social} />
          Facebook Page
        </a>

        <a
          href="https://www.facebook.com/olga.klymenko.376/media_set?set=a.292161304649404&type=3"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.a_contacts_link}
        >
          <Facebook className={classes.icon_contacts_social} />
          Photo Album
        </a>

        <a
          href="https://www.etsy.com/shop/CrazyLeatherThings"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.a_contacts_link}
        >
          <SiEtsy className={classes.icon_contacts_social} />
          Etsy Store
        </a>
      </div>
    </div>
  )
}