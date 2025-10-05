
import { FcCollaboration } from "react-icons/fc";
import { FcCustomerSupport } from "react-icons/fc";


const WhyChooseIcon = () => {
  return (
    <div className=' container mx-auto flex flex-col md:flex-col lg:flex-row justify-between my-10 md:gap-10 lg:gap-20 gap-5 items-center p-3 md:px-5 lg:p-5'>
      <div>
        <h1 className='md:text-6xl font-bold  text-5xl'>প্রাইভেট ইউনিভার্সিটি অ্যাডমিশন সম্পর্কে তথ্য জানতে....</h1>
        <button className='bg-red-700 px-5 py-2 rounded-md text-white text-xl cursor-pointer mt-5'>সরাসরি কথা বলুন</button>
      </div>
      <div className='flex md:gap-5 gap-3'>
        <div className='flex flex-col items-center justify-center bg-red-800 px-5 py-5 rounded md:w-60 gap-2'>
          <p><FcCollaboration size={96} className='font-bold'/></p>
         <div>
             <p className='text-5xl text-white font-semibold'>১০০০+</p>
            <p className='text-white text-2xl'>শিক্ষার্থী</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center bg-red-800 px-5 py-5 rounded md:w-60 gap-5 h-56'>
          <p><FcCustomerSupport size={96} className='font-bold'/></p>
          <div>
             <p className='text-5xl text-white font-semibold'>২০০০+</p>
            <p className='text-white text-2xl'>লার্নিং ম্যাটেরিয়াল</p>
          </div>
         
        </div>

      </div>

    </div>
  );
};

export default WhyChooseIcon;