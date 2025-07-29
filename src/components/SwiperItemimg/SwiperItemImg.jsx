import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import "./SwiperItemImg.css";

export default function SwiperItemImg({ data, id, style }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const swiperRef = useRef(null);
  const [isLoop, setIsLoop] = useState(false)

  useEffect(() => {
    if (data?.length > 1) {
      setIsLoop(true)
    }
  }, [data]);

  const listOfSlide = data.map((el, index) =>
    <SwiperSlide key={'img' + index + id} style={style}>
      <img src={el} alt="" />
    </SwiperSlide>
  );

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.params.pagination.el = paginationRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
      swiper.pagination.init();
      swiper.pagination.update();
    }
  }, []);

  return (
    <div className="swiper-wrapper">
      <div ref={prevRef} className="custom-swiper-button-prev">‹</div>
      <div ref={nextRef} className="custom-swiper-button-next">›</div>
      <div ref={paginationRef} className="custom-swiper-pagination">›</div>
      <Swiper
        loop={isLoop}
        slidesPerView={1}
        slidesPerGroup={1}
        pagination={{ el: paginationRef.current, type: 'fraction', clickable: true }}
        spaceBetween={10}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        speed={2000}
        modules={[Pagination, Navigation]}
      >
        {listOfSlide}
      </Swiper>
    </div>

  );
}