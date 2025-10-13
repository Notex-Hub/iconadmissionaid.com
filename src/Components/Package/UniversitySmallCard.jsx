const UniversitySmallCard = () => {
  const university = [
    {
      id: 1,
      title: "নর্থ সাউথ ইউনিভার্সিটি",
      img: "/public/university/nsu.png",
    },
    {
      id: 2,
      title: "ব্র্যাক ইউনিভার্সিটি",
      img: "/public/university/brac.png",
    },
    {
      id: 3,
      title: "ইস্ট ওয়েস্ট ইউনিভার্সিটি",
      img: "/public/university/east-west.png",
    },
    {
      id: 4,
      title: "আহসানউল্লাহ ইউনিভার্সিটি",
      img: "/public/university/aiub.png",
    },
    {
      id: 5,
      title: "American International University",
      img: "/public/university/aiub.png",
    },
    {
      id: 6,
      title: "Independent University",
      img: "/public/university/iub.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex justify-between items-center gap-5 flex-wrap my-10">
      {university?.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center px-14 py-3 rounded border border-gray-200"
        >
          <img
            className="w-10 h-10 object-contain rounded-full border p-1"
            src={item.img}
            alt={item.title}
          />
        </div>
      ))}
    </div>
  );
};

export default UniversitySmallCard;
