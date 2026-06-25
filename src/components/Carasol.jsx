import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import video from "../image/video.mp4"

const Carasol = ({ category }) => {
  let slides = [];

  if (category === "khadar") {
   slides = [
       { type: 'video', src: video }
    ];
  } else if (category === "valvet") {
   slides = [
       { type: 'video', src: video }
    ];
  } else {
    slides = [
       { type: 'video', src: video }
    ];
  }

  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [
      AutoScroll({
        speed: 2,
        startDelay: 100,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((slide, i) => (
          <div className="embla__slide min-w-full" key={i}>
            {slide.type === 'video' ? (
              <video
                src={slide.src}
                className="w-full h-[250px] md:h-[450px] object-cover rounded-xl"
                alt=""
                autoPlay
                loop
              />
            ) : (
              <img
                src={slide.src}
                className="w-full h-[250px] md:h-[450px] object-cover rounded-xl"
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carasol;
