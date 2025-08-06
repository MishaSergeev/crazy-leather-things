import { useOutletContext } from "react-router-dom";

import { useGlobalData } from '../context/GlobalDataContext'
import { useTranslation } from '../hooks/useTranslation';
import Swiper from './Swiper/Swiper';
import About from './About/About';
import Comments from './Comments/Comments';
import ItemsContainer from './ItemContainer/ItemContainer';
import AddCustomOrder from './AddCustomOrder/AddCustomOrder';
import Contacts from './Contacts/Contacts';

export default function HomePage() {
  const t = useTranslation();
  const { globalData } = useGlobalData()
  const { tab } = useOutletContext();
  return (
    <>
      <main>
        {tab === 'items' && (
          <>
            <Swiper data={globalData.slides_images} />
            <ItemsContainer />
          </>
        )}
        {tab === 'customOrder' && (
          <>
            <AddCustomOrder />
          </>
        )}
        {tab === 'feedback' && (
          <>
            <h2 className='div-comments-title'>{t('comments-title')}</h2>
            <Comments />
          </>
        )}
        {tab === 'info' && (
          <About />
        )}
        {tab === 'contacts' && (
          <Contacts />
        )}
      </main>
    </>
  );
}