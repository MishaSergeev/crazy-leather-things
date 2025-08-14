import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import "./SwiperItem.css";

export default function SwiperItem({ data, id, style, onClick }) {
  const [isLoop, setIsLoop] = useState(false)
  useEffect(() => {
    if (data?.length > 1) {
      setIsLoop(true)
    }
  }, [data]);
  return (
    <Swiper
      loop={isLoop}
      pagination={{ dynamicBullets: true, clickable: true }}
      navigation={true}
      speed={2000}
      modules={[Pagination, Navigation]}
      onClick={onClick}
    >
      {data.map((el, index) => (
        <SwiperSlide key={'img' + id + index} style={style}>
          <img src={el} alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
