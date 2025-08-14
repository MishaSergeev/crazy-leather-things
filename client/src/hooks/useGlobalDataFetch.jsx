import { useEffect, useState } from 'react';
import { nhost } from '../nhost';
import { roundToTwo } from '../utils/round';
import { GET_GLOBAL_DATA } from '../graphql/queries';

export const useGlobalDataFetch = (language) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localize = (ua, en) => language === 'en' && en ? en : ua;

    const fetchAll = async () => {
      try {
        const usdRate = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json')
          .then(res => res.json())
          .then(data => data[0].rate);

        const result = await nhost.graphql.request(GET_GLOBAL_DATA);
        if (result.error) throw result.error;

        const itemsArray = result.data.items || [];
        const categoriesFromItems = itemsArray.map(item => localize(item.category, item.category_en));
        const categoriesFromDb = result.data.categories.map(c => localize(c.name_ukr, c.name_en));
        const Categories = [...new Set([...categoriesFromDb, ...categoriesFromItems])];

        const Items = itemsArray.reduce((acc, item) => {
          acc[item.id] = {
            ...item,
            description: localize(item.description, item.description_en),
            description_full: localize(item.description_full, item.description_full_en),
            category: localize(item.category, item.category_en),
            subcategory: localize(item.subcategory, item.subcategory_en),
            color: localize(item.color, item.color_en),
            price: localize(
              item.price && item.price !== 0 ? roundToTwo(item.price) :
                item.price_usd && usdRate ? roundToTwo(item.price_usd * usdRate) :
                  0,
              roundToTwo(item.price_usd)
            ),
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

        setData({
          ...result.data,
          Categories,
          Items,
          tabs_section: TabsSection,
          tabs_section_user: TabsSectionUser,
          user_tabs: TabsUser,
        });
      } catch (err) {
        console.error('Error loading global data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [language]);

  return { data, loading };
};