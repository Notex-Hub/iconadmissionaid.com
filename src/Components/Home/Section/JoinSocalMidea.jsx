/* src/components/JoinSocialMedia.jsx */
/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import SectionText from "../../Ui/SectionText";

/**
 * Groups data
 * NOTE: corrected image hosts (removed accidental ".com" after i.ibb.co)
 */
export const GROUPS = [
  // Private University
  {
    id: 1,
    title: "Private University Admission group",
    link: "https://www.facebook.com/groups/privateuniversityadmissiongroup",
    university: "Private",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },

  // NSU
  {
    id: 2,
    title: "North South University Admission Help Desk",
    link: "https://www.facebook.com/groups/nsuadmissionhelpdesk/",
    university: "NSU",
    image: "https://i.ibb.co/0jNdV7Gs/Rectangle-22-1.png",
  },
  {
    id: 3,
    title: "BRAC University Admission Help Desk",
    link: "https://www.facebook.com/groups/660767802905541/",
    university: "BRAC",
    image: "https://i.ibb.co/zHns5HjL/Rectangle-20-1.png",
  },
  {
    id: 4,
    title: "East West University Admission Help Desk",
    link: "https://www.facebook.com/groups/1630116420981929",
    university: "EWU",
    image: "https://i.ibb.co/KzNyB0zG/Rectangle-21-1.png",
  },
  {
    id: 5,
    title: "AUST Admission Test Help",
    link: "https://www.facebook.com/groups/austadmissiontesthelp",
    university: "AUST",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },
  {
    id: 6,
    title: "AIUB Admission Test Helpline",
    link: "https://www.facebook.com/groups/aiubadmissiontesthelpline",
    university: "AIUB",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },
  {
    id: 7,
    title: "IUB Admission Test Helpline",
    link: "https://www.facebook.com/groups/iubadmissiontesthelpline",
    university: "IUB",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },
  {
    id: 8,
    title: "UAP Admission Test",
    link: "https://www.facebook.com/groups/uapadmissiontest",
    university: "UAP",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },
  {
    id: 9,
    title: "UIU Admission Test",
    link: "https://www.facebook.com/groups/uiuadmissiontest",
    university: "UIU",
    image: "https://i.ibb.co/gM2p6HsH/Rectangle-23-1.png",
  },
];


// fallback image if item.image missing
const FALLBACK_IMAGE = "https://via.placeholder.com/600x360?text=Group+Image";

/* Small card component */
export function GroupCard({ item }) {
  const imgSrc = item?.image || FALLBACK_IMAGE;
  return (
    <div className="rounded-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ">
      <img
        className="w-full "
        src={imgSrc}
        alt={item?.title || "Group image"}
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 leading-snug text-center">{item.title}</h3>
        {/* {item.university && <p className="text-sm text-gray-600 mb-3">{item.university}</p>} */}
        <div className="flex justify-center items-center">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Join ${item.title} (opens in new tab)`}
            className="w-fit bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000]  text-white font-semibold py-2 px-4 rounded-lg  transition-colors duration-300"
          >
            Join Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* Section: Show only first 4 + View All button */
export function JoinSocialMedia() {
  const firstFour = GROUPS.slice(0, 4);

  return (
    <section className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের ফেসবুক গ্রুপে যোগ দিন" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          সংযুক্ত থাকুন, ভাবনা শেয়ার করুন এবং সব আপডেট সম্পর্কে জানুন
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {firstFour.map((item) => (
          <GroupCard key={item.id} item={item} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto flex justify-center pt-10 pb-16">
        {/* If you use react-router and want client-side navigation, replace the <a> below with:
            <RouterLink to="/groups" className="...">View all groups</RouterLink>
            Otherwise keep the <a> so it works on any setup. */}
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-black font-semibold"
          aria-label="View all groups"
        >
          View all groups
         
        </Link>
      </div>
    </section>
  );
}

export default JoinSocialMedia;
