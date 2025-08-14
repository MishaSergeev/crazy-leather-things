import { useState, useRef, useEffect } from 'react'
import { useAuthenticationStatus } from '@nhost/react'
import { useLocation, useNavigate } from "react-router-dom";
//import { SiEtsy } from 'react-icons/si';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useQty } from '../../hooks/QtyContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../Icon/Icon'
import Button from '../Button/Button';
import TabsSection from '../TabsSection/TabsSection';
import SearchInput from '../SearchInput/SaerchInput';
import Cart from '../Cart/Cart';
import User from '../User/User'
import Modal from '../Modal/Modal';

import './Header.css'

import {
  Outlet,
  NavLink
} from "react-router-dom";

export default function Header() {
  const [tab, setTab] = useState('')
  const navigate = useNavigate();
  const prevTab = useRef(tab);
  const hideTimer = useRef(null);
  const [isModal, setIsModal] = useState(false)
  const [isModalContent, setIsModalContent] = useState('')
  const [isModalSearch, setisModalSearch] = useState(false)
  const location = useLocation();
  const { isAuthenticated,/*  isLoading: authLoading  */ } = useAuthenticationStatus();
  const [showLangButtons, setShowLangButtons] = useState(false);
  const langRef = useRef(null);
  const { language, changeLanguage } = useLanguage('uk');
  const languages = { 'en': 'EN', 'uk': 'UK' }
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserTabs, setShowUserTabs] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };
  const handleClose = () => setIsModal(false);
  const handleCartOpen = () => { setIsModal(true); setIsModalContent('Cart') };
  const handleUserOpen = () => { setIsModal(true); setIsModalContent('User') };
  const handleSearchOpen = () => { isModalSearch ? setisModalSearch(false) : setisModalSearch(true) };
  const handleSearchClose = () => { isModalSearch && setisModalSearch(false) };
  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowUserTabs(true);
  };
  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setShowUserTabs(false);
    }, 3000);
  };
  const { cartQty } = useQty();
  const { favoriteQty } = useQty();

  const handleHomeClick = () => {
    setTab('items');
  };

  const handleUserIconClick = () => {
    navigate('/UserPage', { state: { openMenu: true } });
    setShowUserTabs(false);
  };
  useEffect(() => {
    if (location.pathname !== "/" && tab !== '') {
      prevTab.current = tab;
      setTab("");
    } else if (location.pathname === "/" && prevTab.current !== '') {
      setTab(prevTab.current);
      prevTab.current = tab;
    }
    else if (tab === '' && prevTab.current === '') {
      setTab("items");
    }
  }, [location.pathname, tab]);

  const modalContext = isModalContent === 'Cart' ?
    <Cart onClose={handleClose} /> :
    <User onClose={handleClose} />

  const userSign = isAuthenticated ?
    <div className="header-user-menu-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IconButton>
        <AccountCircleIcon
          className="header-icon"
          onClick={handleUserIconClick}
        />
      </IconButton>

      {showUserTabs && !isMobile && (
        <div className="header-user-menu">
          <TabsSection
            active={tab}
            onChange={(current) => {
              navigate('/UserPage', {
                state: { openMenu: true, initialTab: current },
              })
              setShowUserTabs(false);
            }
            }
            direction="vertical"
            space="UserPage"
          />
        </div>
      )}
    </div> :
    <IconButton>
      <AccountCircleIcon className='header-icon' onClick={handleUserOpen} />
    </IconButton>

  const favoritesSign = isAuthenticated ?
    <NavLink to="/Favorites"><FavoriteBorderIcon className='header-icon' /></NavLink> :
    <FavoriteBorderIcon className='header-icon' onClick={handleUserOpen} />
  return (
    <>
      <header className='header' onClick={handleSearchClose}>
        {isMobile && (
          <MenuIcon className='header-menu-icon' onClick={handleMobileMenuToggle} />
        )}
        <Icon onClick={handleHomeClick} />
        <div className='header-buttom-container'>
          <IconButton sx={{ fontSize: "1.5em" }}>
            <SearchIcon className='header-icon' onClick={handleSearchOpen} />
          </IconButton>

          <IconButton>
            <Badge badgeContent={favoriteQty} color="primary" >
              {favoritesSign}
            </Badge >
          </IconButton>

          <IconButton>
            <Badge badgeContent={cartQty} color="primary">
              <ShoppingCartIcon className='header-icon' onClick={handleCartOpen} />
            </Badge >
          </IconButton>

          <IconButton onClick={() => setShowLangButtons(prev => !prev)}>
            <LanguageIcon className='header-icon' />
          </IconButton>
          {showLangButtons && (
            <ClickAwayListener onClickAway={() => setShowLangButtons(false)}>
              <div ref={langRef} className="language-menu">
                {Object.keys(languages).map((key) => (
                  <Button
                    key={key}
                    style={{
                      border: '1px solid #fff',
                    }}
                    onClick={() => { changeLanguage(key); setShowLangButtons(false); }}
                    disabled={language === key}
                  >
                    {languages[key]}
                  </Button>
                ))}
              </div>
            </ClickAwayListener>
          )}

          {/* <IconButton> */}
          {userSign}
          {/* </IconButton> */}
          {/*           <IconButton sx={{ fontSize: "1.5em" }}>
            <a href="https://www.etsy.com/shop/CrazyLeatherThings" target="_blank" rel="noopener noreferrer">
              <SiEtsy fontSize={"1.05rem"} className='header-icon' />
            </a>
          </IconButton> */}

          <Modal open={isModal} onClose={handleClose} isLogin={isModalContent === 'User'}>
            {modalContext}
          </Modal>
        </div>
      </header >

      {isMobile ? <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <TabsSection
          active={tab}
          onChange={(tab) => {
            setTab(tab);
            setIsMobileMenuOpen(false);
          }}
          space="Main"
          direction="vertical"
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div> :
        <div onClick={handleSearchClose}>
          <TabsSection
            active={tab}
            space="Main"
            onChange={(current) => setTab(current)} />
        </div>}
      <SearchInput isOpen={isModalSearch} onClose={handleSearchClose} />
      <Outlet context={{ tab, setTab }} />
    </>
  )
}