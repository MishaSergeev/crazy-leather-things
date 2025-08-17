import { useState, useRef, useEffect } from "react"
import { useAuthenticationStatus } from "@nhost/react"
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"
import Badge from "@mui/material/Badge"
import IconButton from "@mui/material/IconButton"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SearchIcon from "@mui/icons-material/Search"
import LanguageIcon from "@mui/icons-material/Language"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import clsx from "clsx"

import { useQty } from "../../hooks/QtyContext"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useLanguage } from "../../context/LanguageContext"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import TabsSection from "../TabsSection/TabsSection"
import SearchInput from "../SearchInput/SaerchInput"
import Cart from "../Cart/Cart"
import User from "../User/User"
import Modal from "../Modal/Modal"

import classes from "./Header.module.css"

export default function Header() {
  const [tab, setTab] = useState("")
  const [isModal, setIsModal] = useState(false)
  const [isModalContent, setIsModalContent] = useState("")
  const [isModalSearch, setIsModalSearch] = useState(false)
  const [showLangButtons, setShowLangButtons] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserTabs, setShowUserTabs] = useState(false)

  const prevTab = useRef(tab)
  const hideTimer = useRef(null)
  const langRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthenticationStatus()
  const { cartQty } = useQty()
  const { favoriteQty } = useQty()
  const isMobile = useIsMobile()
  const { language, changeLanguage } = useLanguage("uk")
  const languages = { en: "EN", uk: "UA" }

  const handleMobileMenuToggle = () => setIsMobileMenuOpen((prev) => !prev)
  const handleClose = () => setIsModal(false)
  const handleCartOpen = () => {
    setIsModal(true)
    setIsModalContent("Cart")
  }
  const handleUserOpen = () => {
    setIsModal(true)
    setIsModalContent("User")
  }
  const handleSearchOpen = () => setIsModalSearch((prev) => !prev)
  const handleSearchClose = () => isModalSearch && setIsModalSearch(false)

  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setShowUserTabs(true)
  }
  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setShowUserTabs(false)
    }, 1500)
  }

  const handleHomeClick = () => setTab("items")

  const handleUserIconClick = () => {
    navigate("/UserPage", { state: { openMenu: true } })
    setShowUserTabs(false)
  }

  useEffect(() => {
    if (location.pathname !== "/" && tab !== "") {
      prevTab.current = tab
      setTab("")
    } else if (location.pathname === "/" && prevTab.current !== "") {
      setTab(prevTab.current)
      prevTab.current = tab
    } else if (tab === "" && prevTab.current === "") {
      setTab("items")
    }
  }, [location.pathname, tab])

  const modalContext =
    isModalContent === "Cart" ? (
      <Cart onClose={handleClose} />
    ) : (
      <User onClose={handleClose} />
    )

  const userSign = isAuthenticated ? (
    <div
      className={classes.header_user_menu_container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IconButton>
        <AccountCircleIcon
          className={classes.header_icon}
          onClick={handleUserIconClick}
        />
      </IconButton>

      {showUserTabs && !isMobile && (
        <div className={classes.header_user_menu}>
          <TabsSection
            active={tab}
            onChange={(current) => {
              navigate("/UserPage", {
                state: { openMenu: true, initialTab: current },
              })
              setShowUserTabs(false)
            }}
            direction="vertical"
            space="UserPage"
          />
        </div>
      )}
    </div>
  ) : (
    <IconButton>
      <AccountCircleIcon
        className={classes.header_icon}
        onClick={handleUserOpen}
      />
    </IconButton>
  )

  const favoritesSign = isAuthenticated ? (
      <FavoriteBorderIcon className={classes.header_icon}             
      onClick={() => {
              navigate("/Favorites")
            }}/>
  ) : (
    <FavoriteBorderIcon
      className={classes.header_icon}
      onClick={handleUserOpen}
    />
  )

  return (
    <>
      <header className={classes.header} onClick={handleSearchClose}>
        {isMobile && (
          <MenuIcon
            className={classes.header_menu_icon}
            onClick={handleMobileMenuToggle}
          />
        )}

        <Icon onClick={handleHomeClick} />

        <div className={classes.header_buttom_container}>
          <IconButton sx={{ fontSize: "1.5em" }}>
            <SearchIcon
              className={classes.header_icon}
              onClick={handleSearchOpen}
            />
          </IconButton>

          <IconButton>
            <Badge badgeContent={favoriteQty} color="primary">
              {favoritesSign}
            </Badge>
          </IconButton>

          <IconButton>
            <Badge badgeContent={cartQty} color="primary">
              <ShoppingCartIcon
                className={classes.header_icon}
                onClick={handleCartOpen}
              />
            </Badge>
          </IconButton>

          <IconButton onClick={() => setShowLangButtons((prev) => !prev)}>
            <LanguageIcon className={classes.header_icon} />
          </IconButton>

          {showLangButtons && (
            <ClickAwayListener onClickAway={() => setShowLangButtons(false)}>
              <div ref={langRef} className={classes.language_menu}>
                {Object.keys(languages).map((key) => (
                  <Button
                    key={key}
                    style={{ border: "1px solid #fff" }}
                    onClick={() => {
                      changeLanguage(key)
                      setShowLangButtons(false)
                    }}
                    disabled={language === key}
                  >
                    {languages[key]}
                  </Button>
                ))}
              </div>
            </ClickAwayListener>
          )}

          {userSign}

          <Modal
            open={isModal}
            onClose={handleClose}
            isLogin={isModalContent === "User"}
          >
            {modalContext}
          </Modal>
        </div>
      </header>

      {isMobile ? (
        <div
          className={clsx(classes.mobile_menu, {
            [classes.open]: isMobileMenuOpen,
          })}
        >
          <TabsSection
            active={tab}
            onChange={(tab) => {
              setTab(tab)
              setIsMobileMenuOpen(false)
            }}
            space="Main"
            direction="vertical"
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      ) : (
        <div className={classes.div_main_tabs_section} onClick={handleSearchClose}>
          <TabsSection
            active={tab}
            space="Main"
            onChange={(current) => setTab(current)}
          />
        </div>
      )}

      <SearchInput isOpen={isModalSearch} onClose={handleSearchClose} />
      <Outlet context={{ tab, setTab }} />
    </>
  )
}
