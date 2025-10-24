import Footer from "../../../Layout/Footer";
import SectionText from "../../Ui/SectionText";
import Navbar from "../Navbar/Navbar";
import { GroupCard, GROUPS } from "../Section/JoinSocalMidea";

export function GroupsPage() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4">
        <div className="text-center my-12 md:my-20">
          <SectionText title="সব গ্রুপ একসাথে" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
            এখানে সব বিশ্ববিদ্যালয়ের অ্যাডমিশন হেল্পডেস্ক গ্রুপগুলো পাওয়া যাবে
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-16">
          {GROUPS.map((item) => (
            <GroupCard key={item.id} item={item} />
          ))}
        </div>

      </section>
      <Footer />
    </>


  );
}