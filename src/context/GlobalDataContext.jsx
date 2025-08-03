import { createContext, useContext, useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useUserData } from '@nhost/react';

import { nhost } from '../nhost';
import { roundToTwo } from '../utils/round';
import { useLanguage } from './LanguageContext';
import { fetchUserProfile, syncCart, syncFavorites } from '../utils/userDataHandlers'
import { useQty } from '../components/hooks/QtyContext';

const GlobalDataContext = createContext(null);
export const useGlobalData = () => useContext(GlobalDataContext);

const GET_DATA = gql`
  query {
    slides_images {
      key
      src
    }
    slides_images_about {
      key
      src
    }
    tabs_section {
      id
      desc
      desc_en
    }
    tabs_section_user {
      id
      desc
      desc_en
    }
    user_tabs {
      id
      desc
      desc_en
    }
    categories {
      name_en
      name_ukr
    }
    items {
      id
      link
      description
      description_en
      description_full
      description_full_en
      price
      price_usd
      inventory
      category
      category_en
      subcategory
      subcategory_en
      color
      color_en
      date
      src
    }
  }
`;

export const GlobalDataProvider = ({ children }) => {
  const { language } = useLanguage();
  const user = useUserData();
  const { addItemToCart, addItemToFavorite } = useQty()
  const [globalData, setGlobalData] = useState({
    slides_images: [],
    slides_images_about: [],
    tabs_section: [],
    tabs_section_user: [],
    user_tabs: [],
    Categories: [],
    Items: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const usdRate = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json')
          .then(res => res.json())
          .then(data => data[0].rate);

        const result = await nhost.graphql.request(GET_DATA);
        if (result.error) throw result.error;

        const localize = (ua, en) => language === 'en' && en ? en : ua;
        const itemsArray = result.data.items || [];
        const categoriesFromItems = itemsArray.map(item => localize(item.category, item.category_en))
        const categoriesFromDb = result.data.categories.map(c => localize(c.name_ukr, c.name_en))
        const Categories = [...new Set([...categoriesFromDb, ...categoriesFromItems])]

        const Items = itemsArray.reduce((acc, item) => {
          acc[item.id] = {
            ...item,
            description: localize(item.description, item.description_en),
            description_full: localize(item.description_full, item.description_full_en),
            category: localize(item.category, item.category_en),
            subcategory: localize(item.subcategory, item.subcategory_en),
            color: localize(item.color, item.color_en),
            price: localize(item.price && item.price !== 0 ? roundToTwo(item.price) : item.price_usd && usdRate ? roundToTwo(item.price_usd * usdRate) : 0, roundToTwo(item.price_usd)),
          };
          return acc;
        }, {});

        const TabsSection = result.data.tabs_section.map(tab => ({
          id: tab.id,
          desc: localize(tab.desc, tab.desc_en),
        }));
        const TabsSectionUser = result.data.tabs_section_user.map(tab => ({
          id: tab.id,
          desc: localize(tab.desc, tab.desc_en),
        }));
        const TabsUser = result.data.user_tabs.map(tab => ({
          id: tab.id,
          desc: localize(tab.desc, tab.desc_en),
        }));
        setGlobalData({
          ...result.data,
          Categories,
          Items,
          tabs_section: TabsSection,
          tabs_section_user: TabsSectionUser,
          user_tabs: TabsUser,
        });
      } catch (error) {
        console.error('Global data load error:', error);
        if (error.response) {
          console.error('Response:', error.response);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

  }, [language]);

  useEffect(() => {
    if (!globalData.Items || Object.keys(globalData.Items).length === 0) return;
    if (loading) return;
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
        await fetchUserProfile(user.id);
        await syncCart(user.id, globalData);
        await syncFavorites(user.id);
        addItemToCart();
        addItemToFavorite();
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
