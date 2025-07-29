import { createContext, useContext, useEffect, useState } from 'react';
import { gql } from '@apollo/client';

import { nhost } from '../nhost';
import { roundToTwo } from '../utils/round';
import { useLanguage } from './LanguageContext';

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

        const itemsArray = result.data.items || [];
        const categoriesFromItems = itemsArray.map(item => language === 'en' && item.category ? item.category_en : item.category)
        const categoriesFromDb = result.data.categories.map(c => language === 'en' ? c.name_en : c.name_ukr)
        const Categories = [...new Set([...categoriesFromDb, ...categoriesFromItems])]
        const Items = itemsArray.reduce((acc, item) => {
          acc[item.id] = {
            ...item,
            description: language === 'en' && item.description_en ? item.description_en : item.description,
            description_full: language === 'en' && item.description_full_en ? item.description_full_en : item.description_full,
            category: language === 'en' && item.category ? item.category_en : item.category,
            subcategory: language === 'en' && item.subcategory_en ? item.subcategory_en : item.subcategory,
            color: language === 'en' && item.color_en ? item.color_en : item.color,
            price: language === 'en' && item.price_usd ? roundToTwo(item.price_usd) : (item.price && item.price !== 0 ? roundToTwo(item.price) : roundToTwo(item.price_usd * usdRate)),
          };
          return acc;
        }, {});

        const TabsSection = result.data.tabs_section.map(tab => ({
          id: tab.id,
          desc: language === 'en' && tab.desc_en ? tab.desc_en : tab.desc,
        }));
        const TabsSectionUser = result.data.tabs_section_user.map(tab => ({
          id: tab.id,
          desc: language === 'en' && tab.desc_en ? tab.desc_en : tab.desc,
        }));
        const TabsUser = result.data.user_tabs.map(tab => ({
          id: tab.id,
          desc: language === 'en' && tab.desc_en ? tab.desc_en : tab.desc,
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

  return (
    <GlobalDataContext.Provider value={{ globalData, loading }}>
      {children}
    </GlobalDataContext.Provider>
  );
};
