import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { Pagination, Navigation } from 'swiper/modules';

export default function SwiperItem({ data, id, onClick }) {
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
        <SwiperSlide key={'img' + id + index}>
          <img src={el} alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
