import { useContext } from 'react';

import { FilterContext } from '../hooks/FilterContext';
import { useGlobalData } from '../../context/GlobalDataContext';
import { useLanguage } from '../../context/LanguageContext';
import globalDefaults from  "../../context/InitialGlobalData";
import ItemsGrid from "../Items/Items";
import SearchInput from '../SearchInput/SaerchInput';

import './InputPopup.css'

export default function InputPopup() {
    const { globalData } = useGlobalData()
    const { language } = useLanguage();

    const { filter } = useContext(FilterContext);
    console.log('filter1',filter)
    const ItemsContainer = Object.keys(globalData.Items).map((key) =>
        <ItemsGrid filter={filter} category={globalDefaults.Categories[language]} data={globalData.Items[key]} key={key + '-search'} />
    )
    return (
        <>
        <SearchInput/>
            <div className="div-items-parent-popup" >
                {ItemsContainer}
            </div>
        </>
    )
}