import Button from "../../Ui/Button";
import SectionText from "../../Ui/SectionText";

const JoinSocalMidea = () => {
  const university = [
    {
      id: 1,
      title: "BRAC Spring 2026 Admission Help Desk",
      img: "/public/university/banner1.png",
    },
    {
      id: 2,
      title: "East West University Admission Help Desk",
      img: "/public/university/banner2.png",
    },
    {
      id: 4,
      title: "Private University Admission group",
      img: "/public/university/banner4.png",
    },
  ];
  return (
    <section className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের ফেসবুক গ্রুপে যোগ দিন" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          সংযুক্ত থাকুন, ভাবনা শেয়ার করুন এবং সব আপডেট সম্পর্কে জানুন
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-16">
        {university?.map((item) => (
          <>
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img
                className="w-full h-auto object-cover"
                src={item.img}
                alt={item.title}
              />
              <div className="p-4">
                <h3 className=" font-bold text-lg mb-2">{item.title}</h3>

                <div className="flex justify-center items-center">
                  <button className="w-fit bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="flex justify-center items-center my-5">
        <Button text="View All Courses" />
      </div>
    </section>
  );
};
export default JoinSocalMidea;
