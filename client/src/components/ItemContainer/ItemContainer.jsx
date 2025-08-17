import { useState, useEffect, useContext, useMemo } from 'react'
import clsx from 'clsx'

import { useTranslation } from '../../hooks/useTranslation'
import { FilterContext } from '../../hooks/FilterContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useGlobalData } from '../../context/GlobalDataContext'
import { useLanguage } from '../../context/LanguageContext'
import globalDefaults from '../../context/InitialGlobalData'
import { filterItem } from '../../utils/filter'
import ItemsGrid from '../Items/Items'
import ItemsFilter from '../ItemsFilter/ItemsFilter'
import FormFieldDropDown from '../FormFieldDropDown/FormFieldDropDown'

import classes from './ItemContainer.module.css'

export default function ItemsContainer() {
  const t = useTranslation()
  const { language } = useLanguage()
  const { globalData } = useGlobalData()
  const { filter } = useContext(FilterContext)
  const isMobile = useIsMobile()

  const defaultCategory = useMemo(
    () => globalDefaults.Categories[language],
    [language]
  )

  const [category, setCategory] = useState(defaultCategory)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('newest')

  const branches = [
    { Ref: 'newest', Description: t('sort_newest') },
    { Ref: 'oldest', Description: t('sort_oldest') },
    { Ref: 'price_asc', Description: t('sort_price_asc') },
    { Ref: 'price_desc', Description: t('sort_price_desc') },
  ]

  useEffect(() => {
    setCategory(defaultCategory)
  }, [defaultCategory])

  const filteredItems = useMemo(() => {
    return Object.values(globalData.Items).filter(item =>
      filterItem(
        item,
        category,
        defaultCategory,
        globalDefaults.Categories[language]
      )
    )
  }, [globalData.Items, category, language, defaultCategory])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortOrder === 'newest')
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortOrder === 'oldest')
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortOrder === 'price_asc') return a.price - b.price
      if (sortOrder === 'price_desc') return b.price - a.price
      return 0
    })
  }, [filteredItems, sortOrder])

  const itemsPerPage = 16
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1)
    }
  }, [totalPages, currentPage])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedItems.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedItems, currentPage])

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  )

  return (
    <div className={classes.div_items_tab}>
      {!isMobile && (
        <ItemsFilter active={category} inputSearch={filter} onChange={setCategory} />
      )}
      <div className={classes.div_items_content}>
        <div className={classes.items_header}>
          {!isMobile ? (
            <span className={classes.category_label}>{category}</span>
          ) : (
            <ItemsFilter active={category} inputSearch={filter} onChange={setCategory} />
          )}
          <FormFieldDropDown
            label=""
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            t={t}
            firstOption=""
            options={branches}
            optionsType="Ref"
            type="object"
            width={!isMobile ? '30%' : '100%'}
          />
        </div>
        <div className={classes.div_items_parent}>
          {paginatedItems.map(item => (
            <ItemsGrid key={item.id} data={item} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className={classes.pagination}>
            {pages.map(page => (
              <button
                key={page}
                className={clsx(classes.pagination_btn, {
                  [classes.active]: page === currentPage,
                })}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
