import { useState, useContext } from 'react'
import SearchIcon from '@mui/icons-material/Search';

import { FilterContext } from '../hooks/FilterContext';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import ItemsGrid from '../Items/Items';

import classes from './SearchInput.module.css'

export default function SearchInput({ isOpen, onClose }) {
    const t = useTranslation();
    const [isFocus, setIsFocus] = useState(false)
    const { filter, setFilter } = useContext(FilterContext);
    const { globalData } = useGlobalData()
    const handleChange = (event) => {
        setFilter(event.target.value);
    };
    const handleClick = (event) => {
        if (event.target.id === 'search-container' || event.target.id === '') {
            onClose();
            console.log('event.target.value', event.target.value)
            setFilter('')
        }
    };
    const ItemsContainer = Object.keys(globalData.Items).map((key) =>
        <ItemsGrid filter={filter} search={true} category='null' data={globalData.Items[key]} key={key + '-cont-seach'} />
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
                    <button className={classes["search-button"]}><SearchIcon sx={{ fontSize: "200%" }} /></button>
                    <input
                        id='inputSearch'
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        value={filter}
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