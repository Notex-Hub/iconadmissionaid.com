import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import banner from "../../assets/banner/freetestBanner.png";
import BannerSection from "../../Components/Ui/BannerSection";


const ExamDetails = () => {

    const { slug } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth || {});
    const { data: examData, isLoading, isError } = useGetAllExamQuery();
    const exams = examData?.data ?? [];

    const exam = useMemo(() => {
        if (!slug) return null;
        const s = slug.trim().toLowerCase();
        return exams.find((e) => {
            if (!e?.slug) return false;
            return String(e.slug).trim().toLowerCase() === s;
        }) ?? null;
    }, [exams, slug]);

    const isExamFree = useMemo(() => {
        if (!exam) return false;
        const v = exam.isFree;
        if (typeof v === "boolean") return v === true;
        if (typeof v === "string") {
            const s = v.trim().toLowerCase();
            if (s === "true" || s === "1" || s === "yes") return true;
            if (s === "false" || s === "0" || s === "no") return false;
            if (s === "") return false; // treat empty as paid by default
        }
        if (typeof v === "number") return v === 1;
        if (typeof exam.price === "number") return exam.price === 0;
        return false;
    }, [exam]);

    const handleStart = () => {
        if (!userInfo) {
            navigate(`/exam/${slug}/start`, { state: { redirectTo: `/exam/${slug}/run` } });
            return;
        }
        navigate(`/exam/${slug}/checkout`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>লোড হচ্ছে...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>এক্সাম লোড করতে সমস্যা হয়েছে।</p>
            </div>
        );
    }

    if (!exam) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">এক্সাম পাওয়া যায়নি</h2>
                        <p className="text-gray-600">অনুগ্রহ করে আবার চেষ্টা করুন অথবা হোমে ফিরে যান।</p>
                        <div className="mt-4">
                            <button className="px-2 py-2 bg-black text-white rounded cursor-pointer" onClick={() => navigate(-1)} >Go Back</button>

                        </div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    // helper: determine if exam is accessible (published and schedule/time)
    const isPublished = exam.status === "published";
    const now = new Date();
    const scheduleDate = exam.scheduleDate ? new Date(exam.scheduleDate) : null;
    const isScheduledInFuture = scheduleDate ? scheduleDate > now : false;
    const cover = exam.image ?? exam.moduleId?.cover_photo ?? "/public/university/default.png";


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="absolute top-0 left-0 w-full z-50">
                <Navbar />
            </div>
            <BannerSection
                banner={banner}
                text={{
                    title: "University-Standard Online Exams Smart & Secure",
                    subtitle:
                        "Prepare students with real NSU, BRACU, AUST, EWU, AIUB & IUB exam patterns.",
                }}
            />

            <div className="container mx-auto px-4 pt-10  pb-16">
                <div className=" max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header image */}
                    <div className="w-full h-56 md:h-72 relative">
                        <img
                            src={cover}
                            alt={exam.examTitle}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#7a0000] mb-2">
                            {exam.examTitle || "Exam Title"}
                        </h1>

                        {/* short meta */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 gap-2 mb-4">
                            <div>
                                <span className="font-medium">Type: </span> {exam.examType || "N/A"}
                                {" • "}
                                <span className="font-medium">Questions: </span> {exam.totalQuestion ?? "N/A"}
                            </div>

                            <div>
                                <span className="font-medium">Duration: </span> {exam.mcqDuration ? `${exam.mcqDuration} mins` : "N/A"}
                                {" • "}
                                <span className="font-medium">Marks: </span> {exam.cqMark ?? exam.positiveMark ?? "N/A"}
                            </div>
                        </div>

                        {/* Description / guidelines */}
                        <div className=" rounded-md p-4 mb-4 bg-gray-50">
                            <h3 className="text-xl font-semibold text-[#b91c1c] mb-3">Examination Guidelines</h3>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                <li>Camera must stay on during the exam.</li>
                                <li>Exam must be in full-screen mode.</li>
                                <li>No tab switching is allowed.</li>
                                <li>Developer tools are not permitted.</li>
                                <li>Previous sections cannot be revisited once started.</li>
                                {exam.validTime && (
                                    <li>Valid time: {exam.validTime}</li>
                                )}
                                {scheduleDate && (
                                    <li>Scheduled at: {scheduleDate.toLocaleString()}</li>
                                )}
                            </ul>
                        </div>

                        {/* action area */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                {!isPublished && (
                                    <p className="text-sm text-orange-600 mb-2">এই পরীক্ষা বর্তমানে প্রকাশিত নয়।</p>
                                )}
                                {isScheduledInFuture && (
                                    <p className="text-sm text-gray-600 mb-2">এই পরীক্ষা {scheduleDate.toLocaleString()} তারিখে নির্ধারিত আছে।</p>
                                )}

                                {/* price/label */}
                                <div className="text-lg font-semibold text-gray-800">
                                    {isExamFree ? "Free" : "Paid"}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleStart}
                                    disabled={!isPublished || isScheduledInFuture}
                                    className={`px-6 py-3 cursor-pointer rounded-lg text-white font-medium shadow-sm transition ${(!isPublished || isScheduledInFuture)
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#7a0000] hover:bg-red-700"
                                        }`}
                                >
                                    Start Exam
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-3 rounded-lg   text-gray-700 hover:bg-gray-50"
                                >
                                    Back
                                </button>
                            </div>
                        </div>

                        {/* extra details */}
                        <div className="mt-6 text-sm text-gray-600">

                            {/* show price if available */}
                            {typeof exam.price !== "undefined" && (
                                <p className="text-xl text-green-500 font-medium"><span className="font-medium">Price:</span> {exam.price === 0 ? "Free" : `${exam.price}  ৳`}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExamDetails;
