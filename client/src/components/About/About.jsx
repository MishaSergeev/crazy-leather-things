import { useTranslation } from '../../hooks/useTranslation';
import { useGlobalData } from '../../context/GlobalDataContext'
import Swiper from "../Swiper/Swiper";

import classes from './About.module.css'

export default function About() {
    const t = useTranslation();
    const { globalData } = useGlobalData()
    const AboutStyle = {
        "height": "60vh",
        "width": "60%",
    }
    return (
        <>
            <div className={classes.swiper_about}>
                <Swiper data={globalData.slides_images_about} style={AboutStyle} />
            </div>
            <h2 className={classes.title_about}>
                {t('about_title')}
            </h2>
            <div className={classes.body_about}>
                {t('about')}            
            </div>
        </>
    );
}