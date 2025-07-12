import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../App.css'; 


export default function Carousel({ imageUrls }) {
  const settings = {
    dots: true,
    infinite: imageUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    accessibility: false,
  };
  return (
    <div className="pb-2">
      <Slider {...settings}>
        {imageUrls.map((image, i) => (
          <div key={i}>
            <img src={image} className="w-full h-[360px] object-cover"></img>
          </div>
        ))}
      </Slider>
    </div>
  );
}
