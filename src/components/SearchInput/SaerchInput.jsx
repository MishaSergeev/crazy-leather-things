import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';

import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import { searchItem } from '../../utils/filter';
import ItemsGrid from '../Items/Items';

import classes from './SearchInput.module.css'

export default function SearchInput({ isOpen, onClose }) {
    const t = useTranslation();
    const [isFocus, setIsFocus] = useState(false)
    const { globalData } = useGlobalData()
    const [inputText, setInputText] = useState('')
    const [filteredItems, setFilteredItems] = useState([])

    const handleChange = (event) => {
        const value = event.target.value;
        setInputText(value);

        if (!value.trim()) {
            setFilteredItems([]);
            return;
        }

        const items = Object.values(globalData.Items).filter(item => searchItem(item, value));
        setFilteredItems(items);
    };
    const handleClick = (event) => {
        if (event.target.id === 'search-container' || event.target.id === '') {
            onClose();
            setInputText('')
            setFilteredItems([])
        }
    };
    const ItemsContainer = filteredItems.map((el) =>
        <ItemsGrid data={el} key={el.id + '-cont-search'} />
    )
    

    return (
        <>
            <div
                id='search-container'
                className={
                    isOpen ? `${classes["search-box"]} ${classes["search-box-show"]}` : classes["search-box"]
                }
                onClick={handleClick}>
                <div
                    className={
                        isFocus ? `${classes["search"]} ${classes.focus}` : classes["search"]
                    }>
                    <button aria-label={t('search')} className={classes["search-button"]}><SearchIcon sx={{ fontSize: "calc(0.8em + 1vw)" }} /></button>
                    <input
                        id='inputSearch'
                        aria-label={t('search')}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        value={inputText}
                        onChange={handleChange}
                        className={
                            isFocus ? `${classes["search-input"]} ${classes.focus}` : classes["search-input"]
                        }
                        placeholder={!isFocus ? t('search') : ""}
                    ></input>
                </div>
                <div id='seach-item-container' className={classes["seach-item-container"]}>
                    {ItemsContainer}
                </div>
            </div>

        </>
    )
}