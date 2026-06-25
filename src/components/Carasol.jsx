import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import video from "images/video.mp4"

const Carasol = ({ category }) => {
  let slides = [];

  if (category === "khadar") {
    slides = [
      "video.mp4",
     
    ];
  } else if (category === "valvet") {
    slides = [
      "video.mp4",
     
    ];
  } else {
    slides = [
      "video.mp4",
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
        {slides.map((img, i) => (
          <div className="embla__slide min-w-full" key={i}>
            <img
              src={img}
              className="w-full h-[250px] md:h-[450px] object-cover rounded-xl"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carasol;
