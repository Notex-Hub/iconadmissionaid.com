/* eslint-disable react/prop-types */
// Pure React (no TypeScript). Save as .jsx if you want JSX syntax.
// Exports two components:
// 1) JoinSocialMedia — shows the first 4 groups and a "View all groups" button
// 2) GroupsPage — shows ALL groups on a dedicated page (use it at /groups)
//
// How to use:
// - On your homepage/section, render <JoinSocialMedia />
// - Create a route/page at /groups that renders <GroupsPage />
// Optional: Replace <a href> with Next.js <Link> if you use Next Router.

import SectionText from "../../Ui/SectionText";

// ---- Shared data -----------------------------------------------------------
const COMMON_IMAGE =
  "../../../../public/groups/Rectangle 20.png";

export const GROUPS = [
  // NSU
  {
    id: 1,
    title: "North South University Admission Help Desk",
    link: "https://www.facebook.com/groups/nsuadmissionhelpdesk/",
    university: "NSU",
  },
  {
    id: 2,
    title: "NSU Summer 2025 Admission Help Desk",
    link: "https://www.facebook.com/groups/714828723553900/",
    university: "NSU",
  },

  // BRAC
  {
    id: 3,
    title: "BRAC University Admission Help Desk",
    link: "https://www.facebook.com/groups/660767802905541/",
    university: "BRAC",
  },
  {
    id: 4,
    title: "BRAC Summer 2025 Admission Help Desk",
    link: "https://www.facebook.com/groups/646857520994185/",
    university: "BRAC",
  },

  // EWU
  {
    id: 5,
    title: "East West University Admission Help Desk",
    link: "https://www.facebook.com/groups/1630116420981929",
    university: "EWU",
  },
  {
    id: 6,
    title: "East West University Spring 2026 Admission Help Desk",
    link: "https://www.facebook.com/groups/eastwestuniversityadmissiontest",
    university: "EWU",
  },

  // Private University
  {
    id: 7,
    title: "Private University Admission group",
    link: "https://www.facebook.com/groups/privateuniversityadmissiongroup",
    university: "Private",
  },

  // IUB
  {
    id: 8,
    title: "IUB Admission Test Helpline",
    link: "https://www.facebook.com/groups/iubadmissiontesthelpline",
    university: "IUB",
  },

  // AIUB
  {
    id: 9,
    title: "AIUB Admission Test Helpline",
    link: "https://www.facebook.com/groups/aiubadmissiontesthelpline",
    university: "AIUB",
  },

  // AUST
  {
    id: 10,
    title: "AUST Admission Test Help",
    link: "https://www.facebook.com/groups/austadmissiontesthelp",
    university: "AUST",
  },

  // UAP
  {
    id: 11,
    title: "UAP Admission Test",
    link: "https://www.facebook.com/groups/uapadmissiontest",
    university: "UAP",
  },

  // UIU
  {
    id: 12,
    title: "UIU Admission Test",
    link: "https://www.facebook.com/groups/uiuadmissiontest",
    university: "UIU",
  },
];

// ---- Small card component --------------------------------------------------
export function GroupCard({ item }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 bg-white">
      <img className="w-full h-44 object-cover" src={COMMON_IMAGE} alt={item.title} />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 leading-snug">{item.title}</h3>
        {item.university && (
          <p className="text-sm text-gray-600 mb-3">{item.university}</p>
        )}
        <div className="flex justify-center items-center">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Join Now
          </a>
        </div>
      </div>
    </div>
  );
}



// ---- 1) Section: Show only first 4 + View All button ----------------------
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
        {/* If you're on Next.js, wrap this <a> with <Link href="/groups"> */}
        <a
          href="/groups"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold"
        >
          View all groups
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}


export default JoinSocialMedia;
