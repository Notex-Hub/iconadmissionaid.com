import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { useGetAllSubjectQuery } from "../../../redux/Features/Api/subject/subject";
import { useGetAllModelTestQuery } from "../../../redux/Features/Api/modelTest/modelTest";

const ExamDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: subjects } = useGetAllSubjectQuery();
    const { data: modelTests } = useGetAllModelTestQuery();

    const modelTest = modelTests?.data?.find((test) => test?.slug === slug);

    // All subjects under this modelTest
    const subjectList = subjects?.data?.filter(
        (sub) => sub?.modelTest?.slug === slug
    );

    console.log(subjectList)

    const sectionsOrderForSubject = modelTest?.sectionsOrderForSubject || [];
    const sectionsOrderForEnglish = modelTest?.sectionsOrderForEnglish || [];


    return (
        <div className="relative overflow-x-hidden">
            <Navbar />
            <div className="max-w-5xl mx-auto mt-32 px-4 pb-20">
                {/* 🔹 Model Test Main Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                    <img
                        src={modelTest?.image}
                        alt={modelTest?.title}
                        className="w-full h-60 object-cover rounded-xl"
                    />

                    <h2 className="text-3xl font-bold mt-4">{modelTest?.title}</h2>
                    <p className="text-gray-600">University: {modelTest?.university}</p>

                    <div className="mt-2">
                        <p className="font-semibold">Departments:</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                            {modelTest?.departments?.map((d) => (
                                <span
                                    key={d}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                >
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🔹 Subject & Under Exams */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4">Subjects</h3>
                    <div
                        className="border border-gray-200 rounded-xl p-4 mb-5"
                    >
                        <div className="mb-4">
                            <p className="font-semibold mb-1">Subject Order:</p>
                            <div className="flex gap-2 flex-wrap">
                                {sectionsOrderForSubject?.map((sec) => (
                                    <span
                                        key={sec}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm"
                                    >
                                        {sec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/exam/start/${modelTest?.slug}`)}
                        className="px-2.5 py-2 bg-red-500 text-white rounded-md"
                    >
                        Start Exam
                    </button>

                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ExamDetails;
