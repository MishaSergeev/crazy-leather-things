import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import Swiper from "../Swiper/Swiper";

import './About.css'

export default function About() {
    const t = useTranslation();
    const { globalData } = useGlobalData()
    const AboutStyle = {
        "height": "60vh",
        "width": "60%",
    }
    return (
        <>
            <div className='swiper-about'>
                <Swiper data={globalData.slides_images_about} style={AboutStyle} />
            </div>
            <h2 className='title-about'>
                {t('about_title')}
            </h2>
            <div className='body-about'>
                {t('about')}            
            </div>
        </>
    );
}