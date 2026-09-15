import React from 'react'
import mainn from '../image/mainn.png' 


const Carasol = () => { return ( 
<div className="w-full h-18 mt-2"> 
  <img src={mainn} alt="" /> 
  </div> ) }
 export default Carasol





// import React, { useCallback, useEffect } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import AutoScroll from "embla-carousel-auto-scroll";
// import caraaa from "../image/caraaa.png";
// import v from "../image/v.jpg";
// import main from '../image/main.png'
// const Carasol = ({ category }) => {
//   let slides = [];

//    <div className="w-full h-full mt-5">
//                  <img
//                    src={main}
//                    alt=""
                   
//                  />
//                </div>
//   if (category === "khadar") {
//     slides = [
//       "https://hub.wtm.com/wp-content/uploads/2018/08/Blogging.jpg",
//       "https://image/cc1.webp",
//       "https://cdn.shopify.com/s/files/1/0248/7892/t/52/assets/hamilton-watches-banner_1440x.jpg",
//       "https://i.pinimg.com/originals/4f/7f/83/4f7f83f20552d1055c2f7f4a3d84b6bf.jpg",
//     ];
//   } else if (category === "valvet") {
//     slides = [
//       "https://hub.wtm.com/wp-content/uploads/2018/08/Blogging.jpg",
//       "https://image/cc1.webp",
//       "https://cdn.shopify.com/s/files/1/0248/7892/t/52/assets/hamilton-watches-banner_1440x.jpg",
//       "https://i.pinimg.com/originals/4f/7f/83/4f7f83f20552d1055c2f7f4a3d84b6bf.jpg",
//     ];
//   } else {
//     slides = [
//       v,
//       caraaa,

//       //"https://www.mariab.pk/cdn/shop/files/Luxury_Pret_Web_Banner_02.jpg?v=1763444782",
//     ];
//   }

//   const [emblaRef] = useEmblaCarousel(
//     { loop: true },
//     [
//       AutoScroll({
//         speed: 2,
//         startDelay: 100,
//         stopOnInteraction: false,
//         stopOnMouseEnter: true,
//       }),
//     ]
//   );

//   return (
//     <div className="embla overflow-hidden w-full" ref={emblaRef}>
//       <div className="embla__container flex">
//         {slides.map((img, i) => (
//           <div
//             className="embla__slide flex-[0_0_100%] min-w-0"
//             key={i}
//           >
//             <img
//               src={img}
//               className="w-full h-[180px] xs:h-[220px] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-xl select-none"
//               alt=""
//               draggable="false"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default Carasol;
