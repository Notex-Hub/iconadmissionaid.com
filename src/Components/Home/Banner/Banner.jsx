import banner from '../../../assets/Home/Slider-1 1.png'
export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full  ">
        <img
          src={banner}
          alt="ICON Education Platform - Target BRACU Online Live Class"
          className="object-center object-cover h-[500px] lg:w-full lg:h-full"
        />
        {/* <div className="absolute inset-0 bg-black/10 lg:bg-transparent" /> */}

     
      </div>
    </section>
  )
}
