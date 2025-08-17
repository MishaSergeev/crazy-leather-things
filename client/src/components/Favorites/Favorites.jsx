import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useUserData, useAuthenticationStatus } from "@nhost/react"
import CloseIcon from "@mui/icons-material/Close"

import { nhost } from "../../nhost"
import { useQty } from "../../hooks/QtyContext"
import { useTranslation } from "../../hooks/useTranslation"
import { useGlobalData } from "../../context/GlobalDataContext"
import { useLanguage } from "../../context/LanguageContext"
import { DELETE_FAVORITES_ITEM } from "../../graphql/queries"
import globalDefaults from "../../context/InitialGlobalData"
import ItemCartButton from "../ItemCartButton/ItemCartButton"
import ItemImg from "../ItemImg/ItemImg"

import classes from "./Favorites.module.css"

export default function Favorites({ onClose }) {
  const t = useTranslation()
  const { language } = useLanguage()
  const { isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()
  const { addItemToFavorite } = useQty()
  const { globalData } = useGlobalData()

  const [favoriteData, setFavoriteData] = useState({ ...globalDefaults.favorite })

  const removeItemFromFavorite = async (itemId) => {
    const updatedFavorite = { ...favoriteData }
    delete updatedFavorite[itemId]
    setFavoriteData(updatedFavorite)
    delete globalDefaults.favorite[itemId]
    addItemToFavorite()

    if (isAuthenticated && user) {
      try {
        await nhost.graphql.request(DELETE_FAVORITES_ITEM, {
          user_id: user.id,
          item_id: itemId,
        })
      } catch (err) {
        console.error("Error removing FAVORITES:", err)
      }
    }
  }

  const FavoriteTitle =
    Object.keys(globalDefaults.favorite).length > 0 ? (
      <div className={classes.div_title_favorite}>
        <div></div>
        <div>{t("iten_name")}</div>
        <div>{t("iten_price")}</div>
        <div></div>
        <div></div>
      </div>
    ) : (
      <></>
    )

  const ItemsInFavorite =
    Object.keys(globalDefaults.favorite).length > 0 ? (
      Object.keys(globalDefaults.favorite).map((key) => (
        <div className={classes.div_items_favorite} key={key}>
          <div className={classes.img_item_favorite}>
            <ItemImg data={globalData.Items[key]} onClick={onClose} />
          </div>
          <NavLink
            to={globalData.Items[key].link}
            style={{ color: "#000000", textDecoration: "none" }}
            onClick={onClose}
          >
            <div>{globalData.Items[key].description}</div>
          </NavLink>
          <div>
            {globalData.Items[key].price} {globalDefaults.currency[language]}
          </div>
          <ItemCartButton data={globalData.Items[key]} />
          <CloseIcon onClick={() => removeItemFromFavorite(key)} />
        </div>
      ))
    ) : (
      <div className={classes.div_empty_favorite}>{t("favorites_empty")}</div>
    )

  return (
    <>
      {FavoriteTitle}
      <div className={classes.div_items_favorite_container}>
        <div className={classes.div_items_favorite_parent}>{ItemsInFavorite}</div>
      </div>
    </>
  )
}