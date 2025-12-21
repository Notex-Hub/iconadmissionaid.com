/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Link এর বদলে useNavigate
import Navbar from "../../Components/Home/Navbar/Navbar";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freetestBanner.png";
import { useSelector } from "react-redux";

// API Helper to post form data
const postFreeTestLead = async ({ name: n, number: num, interested: intr = "" }) => {
  const payload = { name: n, number: num, intersted: intr, crmStatus: "Pending", status: "Processing" };
  const res = await fetch(
    "https://sandbox.iconadmissionaid.com/api/v1/free-test/create-free-test",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return await res.json();
};

// --- Modal Form Component ---
const TestAccessForm = ({ onSubmit, onClose, examTitle }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !number) {
      setError("দয়া করে নাম ও নম্বর পূরণ করুন");
      return;
    }
    try {
      setLoading(true);
      await postFreeTestLead({ name, number, interested: `Free Test: ${examTitle}` });
      onSubmit();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">ফ্রি মডেল টেস্ট শুরু করুন</h3>
          <p className="text-sm text-gray-500 mt-1">টেস্টটি শুরু করতে নিচের তথ্যগুলো দিন</p>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">আপনার নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"
              placeholder="নাম লিখুন"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মোবাইল নম্বর</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"
              placeholder="017XXXXXXXX"
            />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#8B0000] text-white font-bold py-3 rounded-xl hover:bg-red-800 transition-colors disabled:opacity-50"
            >
              {loading ? "প্রসেসিং হচ্ছে..." : "টেস্ট শুরু করুন"}
            </button>
            <button type="button" onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 font-medium">
              বাতিল করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FreeTest = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [pendingExam, setPendingExam] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("https://sandbox.iconadmissionaid.com/api/v1/model-test");
        const data = await res.json();
        if (data.status) setExams(data.data);
        else setError(true);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleExamClick = (exam) => {
    if (userInfo) {
      navigate(`/exam/exam-details/${exam.slug}`);
    } else {
      setPendingExam(exam);
      setShowForm(true);
    }
  };

  const handleFormSubmitSuccess = () => {
    const targetSlug = pendingExam.slug;
    setShowForm(false);
    setPendingExam(null);
    navigate(`/exam/exam-details/${targetSlug}`);
  };

  const universities = Array.from(new Set(exams.map((exam) => exam.university)));
  const filteredExams = selectedUniversity ? exams.filter((exam) => exam.university === selectedUniversity) : exams;

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <BannerSection
        banner={banner}
        text={{
          title: "University-Standard Online Exams Smart & Secure",
          subtitle: "Prepare students with real NSU, BRACU, AUST, EWU, AIUB & IUB exam patterns.",
        }}
      />

      <div className="container mx-auto px-4 pb-20">
        <div className="text-center my-12 md:my-16">
          <SectionText title="বিশ্ববিদ্যালয়ের ভিত্তিক মডেল টেস্ট" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
            বিশ্ববিদ্যালয়ের স্টাইল অনুযায়ী মডেল টেস্ট সমূহ।
          </p>
        </div>

        {/* University filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-10">
          {universities.map((uni, idx) => (
            <button
              key={idx}
              className={`px-5 py-2 rounded-full border transition-all font-medium ${
                selectedUniversity === uni ? "bg-[#8B0000] text-white border-[#8B0000] shadow-lg shadow-red-100" : "bg-white text-gray-600 border-gray-200 hover:border-[#8B0000]"
              }`}
              onClick={() => setSelectedUniversity(uni)}
            >
              {uni}
            </button>
          ))}
          {selectedUniversity && (
            <button onClick={() => setSelectedUniversity("")} className="px-5 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50">
              Reset
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-gray-300 animate-pulse uppercase tracking-widest">Loading Exams...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">এক্সাম লোড করতে সমস্যা হয়েছে।</div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center py-20">টেস্ট পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                onClick={() => handleExamClick(exam)}
                className="group cursor-pointer bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(139,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-full h-52 overflow-hidden relative">
                  <img src={exam.image || "/university/default.png"} alt={exam.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                     <span className="text-white font-bold">Start Exam →</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-1">{exam.title}</h3>
                  <p className="text-[#8B0000] font-bold text-sm mb-4">{exam.university}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exam.departments?.map((dep, i) => (
                      <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-3 py-1 rounded-full font-bold uppercase">{dep}</span>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Admission Test</span>
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Access Modal --- */}
      {showForm && (
        <TestAccessForm
          examTitle={pendingExam?.title}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmitSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default FreeTest;