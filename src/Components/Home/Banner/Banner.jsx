import { useGetAllBannerQuery } from '../../../../redux/Features/Api/banner/banner'
// Swiper (Slider) এর জন্য ইমপোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection() {
  const { data: bannerData, isLoading } = useGetAllBannerQuery();
  const banners = bannerData?.data || [];

  if (isLoading) {
    return (
      <div className="w-full h-[300px] lg:h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-300 font-bold tracking-widest">LOADING HERO...</span>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {banners.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect={'fade'}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-auto"
        >
          {banners.map((item) => (
            <SwiperSlide key={item._id}>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <img
                  src={item.image}
                  alt="Banner"
                  className="w-full h-auto min-h-[250px] md:min-h-[400px] object-contain lg:object-cover"
                />
                <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-all duration-300" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-50">
           <p className="text-gray-400 italic">No Active Banners Found</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet-active {
          background: #8B0000 !important;
          width: 25px !important;
          border-radius: 5px !important;
        }
        .swiper-pagination-bullet {
          transition: all 0.3s;
        }
      `}} />
    </section>
  )
}