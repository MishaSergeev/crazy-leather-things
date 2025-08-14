import { createContext, useContext, useEffect, useState } from 'react';
import { useUserData } from '@nhost/react';

import { useLanguage } from './LanguageContext';
import { useQty } from '../hooks/QtyContext';
import { fetchUserProfile, syncCart, syncFavorites } from '../utils/userDataHandlers';
import { useGlobalDataFetch } from '../hooks/useGlobalDataFetch';

const GlobalDataContext = createContext(null);
export const useGlobalData = () => useContext(GlobalDataContext);

export const GlobalDataProvider = ({ children }) => {
  const user = useUserData();
  const { language } = useLanguage();
  const { addItemToCart, addItemToFavorite } = useQty();
  const [globalData, setGlobalData] = useState({
    slides_images: [],
    slides_images_about: [],
    tabs_section: [],
    tabs_section_user: [],
    user_tabs: [],
    Categories: [],
    Items: {},
  });

  const { data, loading } = useGlobalDataFetch(language);

  useEffect(() => {
    if (data) {
      setGlobalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!globalData.Items || Object.keys(globalData.Items).length === 0 || loading) return;

    if (!user?.id && localStorage.getItem('cart')) {
      const fetchCart = async () => {
        try {
          const savedCart = localStorage.getItem('cart');
          await syncCart(null, globalData, JSON.parse(savedCart));
          addItemToCart();
        } catch (err) {
          console.error('Sync cart error:', err);
        }
      };
      fetchCart();
      return;
    }

    const fetchUser = async () => {
      try {
        if(user?.id){
        await fetchUserProfile(user.id);
        await syncCart(user.id, globalData);
        await syncFavorites(user.id);
        addItemToCart();
        addItemToFavorite();}
      } catch (err) {
        console.error('User data error:', err);
      }
    };

    fetchUser();
  }, [user?.id, loading, globalData, addItemToCart, addItemToFavorite]);

  return (
    <GlobalDataContext.Provider value={{ globalData, loading }}>
      {children}
    </GlobalDataContext.Provider>
  );
};
