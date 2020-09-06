import React from 'react';
import { Carousel } from 'antd';

const ImageSlider = (props) => {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div key={index}>
            <div key={index} className="img" style={{ backgroundImage: `url(/${image})`, width: '100%', height: '50vh', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;