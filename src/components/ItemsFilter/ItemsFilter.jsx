import { useContext } from 'react'

import { FilterContext } from '../hooks/FilterContext';
import { useGlobalData } from '../../context/GlobalDataContext'
import Button from '../Button/Button'

import './ItemsFilter.css'
export default function ItemsFilter({ active, onChange }) {
  const { globalData } = useGlobalData()
  const { setFilter } = useContext(FilterContext);
  const handleChange = () => {
    setFilter('');
  };
  const buttonSection = globalData.Categories.map((el) =>
    <Button key={el}
      isActive={active === el}
      onClick={() => { handleChange(); onChange(el) }} >
      {el}
    </Button>
  )

  return (
    <div className='item-filter'>
      {buttonSection}
    </div>
  )
}