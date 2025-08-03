import { useState, useEffect, useContext } from 'react';

import { useTranslation } from '../hooks/useTranslation';
import { FilterContext } from '../hooks/FilterContext';
import { useGlobalData } from '../../context/GlobalDataContext';
import { useLanguage } from '../../context/LanguageContext';
import globalDefaults from "../../context/InitialGlobalData";
import ItemsGrid from "../Items/Items";
import ItemsFilter from "../ItemsFilter/ItemsFilter";

import './ItemContainer.css';

export default function ItemsContainer() {
  const t = useTranslation();
  const { language } = useLanguage();
  const { globalData } = useGlobalData();
  const { filter } = useContext(FilterContext);

  const isMobile = window.innerWidth <= 768;

  const [category, setCategory] = useState(globalDefaults.Categories[language]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest');

  const items = Object.values(globalData.Items)
    .filter(item => category === globalDefaults.Categories[language] || item.category === category)
    .filter(item => item.description?.toLowerCase().includes(filter.toLowerCase()))

  const sortedItems = [...items].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortOrder === 'price_asc') return a.price - b.price;
    if (sortOrder === 'price_desc') return b.price - a.price;
    return 0;
  });

  const itemsPerPage = 16;
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCategory(globalDefaults.Categories[language]);
  }, [language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, sortOrder]);

  return (
      <div className="div-items-tab">
        {!isMobile && (
          <ItemsFilter
            active={category}
            inputSearch={filter}
            onChange={(current) => setCategory(current)}
          />
        )}
        <div className="div-items-content">
          <div className="items-header">
            {!isMobile ?
              <span
                className="category-label"
              >
                {category}
              </span> :
              <ItemsFilter
                active={category}
                inputSearch={filter}
                onChange={(current) => setCategory(current)}
              />}
            <select
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">{t('sort_newest')}</option>
              <option value="oldest">{t('sort_oldest')}</option>
              <option value="price_asc">{t('sort_price_asc')}</option>
              <option value="price_desc">{t('sort_price_desc')}</option>
            </select>
          </div>
          <div className="div-items-parent">
            {paginatedItems.map((item) => (
              <ItemsGrid
                filter={filter}
                category={category}
                data={item}
                key={item.id}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}