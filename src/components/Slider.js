import React, { useEffect, useState } from 'react';
import '../css/slider.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay } from 'swiper/modules'; // Updated imports for modules
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Slide from './SlideItem';
import { useFirestore } from '../App'; // Import the hook from App.js

function Slider({ loading, error, moviza, Imdb }) {
    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    return (
        <Swiper className='slider'
            modules={[Navigation, EffectFade, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            effect="fade"
            loop={true}
            autoplay={{
                delay: 10000, // time in ms between slides (3 seconds)
                disableOnInteraction: false, // autoplay will not be disabled after user interactions
            }}
        >
            {moviza.map((item, index) => {
                if (index < 7) {
                    return <SwiperSlide key={index}><Slide item={item} Imdb={Imdb} ></Slide></SwiperSlide>
                }
            })}
        </Swiper>
    );
}

export default Slider;
