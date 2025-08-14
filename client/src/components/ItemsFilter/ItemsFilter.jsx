import { useContext } from 'react';

import { FilterContext } from '../../hooks/FilterContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useGlobalData } from '../../context/GlobalDataContext';
import Button from '../Button/Button';

import './ItemsFilter.css';

export default function ItemsFilter({ active, onChange }) {
  const { globalData } = useGlobalData();
  const { setFilter } = useContext(FilterContext);

  const handleChange = () => setFilter('');
  const isMobile = useIsMobile();

  const handleSelectChange = (e) => {
    const selectedCategory = e.target.value;
    if (globalData.Categories.includes(selectedCategory)) {
      handleChange();
      onChange(selectedCategory);
    }
  };

  return (
    <>
      {isMobile ? (
        <select
          className="sort-select"
          value={active}
          onChange={handleSelectChange}
        >
          {globalData.Categories.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      ) : (
        <div className="item-filter">
          {globalData.Categories.map((el) => (
            <Button
              key={el}
              isActive={active === el}
              onClick={() => {
                handleChange();
                onChange(el);
              }}
            >
              {el}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}