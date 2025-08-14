import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import "./Swiper.css";

export default function SwiperProd(data) {
  const images = data.data
  const style = data.style
  const listOfSlide = images.map((el) =>
    <SwiperSlide key={el.key}
      style={style}
    ><img src={el.src} alt="" /></SwiperSlide>
  )
  return (
    <>
      <Swiper
        loop={images.length > 1}
        slidesPerView={1}
        slidesPerGroup={1}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        speed={2000}
        modules={[Pagination, Autoplay]}
      >
        {listOfSlide}
      </Swiper>
    </>
  );
}