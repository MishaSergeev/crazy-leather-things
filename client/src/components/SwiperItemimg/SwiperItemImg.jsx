import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from 'swiper/modules';

import { useIsMobile } from '../../hooks/useIsMobile';

import classes from "./SwiperItemImg.module.css";

export default function SwiperItemImg({ data, id }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const swiperRef = useRef(null);
  const [isLoop, setIsLoop] = useState(false)
  const isMobile = useIsMobile();

  useEffect(() => {
    if (data?.length > 1) {
      setIsLoop(true)
    }
  }, [data]);

  const listOfSlide = data.map((el, index) =>
    <SwiperSlide key={'img' + index + id}>
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
      {!isMobile && <div ref={prevRef} className={classes.custom_swiper_button_prev}>‹</div>}
      {!isMobile && <div ref={nextRef} className={classes.custom_swiper_button_next}>›</div>}
      <div ref={paginationRef} className={classes.custom_swiper_pagination}>›</div>
      <Swiper
        loop={isLoop}
        slidesPerView={1}
        slidesPerGroup={1}
        pagination={{ el: paginationRef.current, type: 'fraction', clickable: true }}
        spaceBetween={10}
        navigation={!isMobile ? { prevEl: prevRef.current, nextEl: nextRef.current } : true}
        speed={2000}
        modules={[Pagination, Navigation]}
      >
        {listOfSlide}
      </Swiper>
    </div>

  );
}