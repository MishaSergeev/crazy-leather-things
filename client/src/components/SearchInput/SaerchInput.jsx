import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import clsx from 'clsx'

import { useTranslation } from '../../hooks/useTranslation'
import { useGlobalData } from '../../context/GlobalDataContext'
import { searchItem } from '../../utils/filter'
import ItemsGrid from '../Items/Items'

import classes from './SearchInput.module.css'

export default function SearchInput({ isOpen, onClose }) {
  const t = useTranslation()
  const { globalData } = useGlobalData()

  const [isFocus, setIsFocus] = useState(false)
  const [inputText, setInputText] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  const handleChange = (event) => {
    const value = event.target.value
    setInputText(value)

    if (!value.trim()) {
      setFilteredItems([])
      return
    }

    const items = Object.values(globalData.Items).filter((item) =>
      searchItem(item, value)
    )
    setFilteredItems(items)
  }

  const handleClick = (event) => {
    if (event.target.id === 'search-container' || event.target.id === '') {
      onClose()
      setInputText('')
      setFilteredItems([])
    }
  }

  const ItemsContainer = filteredItems.map((el) => (
    <ItemsGrid data={el} key={el.id + '_cont_search'} />
  ))

  return (
    <div
      id="search-container"
      className={clsx(classes.search_box, { [classes.search_box_show]: isOpen })}
      onClick={handleClick}
    >
      <div
        className={clsx(classes.search, {
          [classes.focus]: isFocus,
        })}
      >
        <button
          aria-label={t('search')}
          className={classes.search_button}
        >
          <SearchIcon sx={{ fontSize: 'calc(0.8em + 1vw)' }} />
        </button>
        <input
          id="inputSearch"
          aria-label={t('search')}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={inputText}
          onChange={handleChange}
          className={clsx(classes.search_input, {
            [classes.focus]: isFocus,
          })}
          placeholder={!isFocus ? t('search') : ''}
        />
      </div>
      <div
        id="seach-item-container"
        className={classes.seach_item_container}
      >
        {ItemsContainer}
      </div>
    </div>
  )
}
