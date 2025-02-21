import { ImProfile } from "react-icons/im";
import { LuBrainCircuit } from "react-icons/lu";
import { BriefcaseIcon } from "lucide-react"


const HowItWorks = () => {
    return (
        <div className="bg-gray-50 py-20">
            <h1 className="text-center text-4xl drop-shadow-xl font-semibold">How It Works</h1>

            <div className="max-w-7xl mx-auto flex my-8 gap-20 items-center md:flex-row flex-col">

                <div className=" flex flex-col justify-center items-center">
                <p className=" text-purple-600"><ImProfile className="h-12 w-12"/></p>
                <h2 className="text-xl  my-1 font-semibold">Create Your Profile</h2>
                <p className="text-center">Build your digital resume with skills, experience, and preferences.</p>
                </div>

                <div className=" flex flex-col justify-center items-center">
                <p className=" text-blue-600"><LuBrainCircuit className="h-12 w-12"/></p>
                <h2 className="text-xl  my-1 font-semibold">AI Matching</h2>
                <p className="text-center">Our AI analyzes your profile and matches you with suitable job opportunities.</p>
                </div>

                <div className=" flex flex-col justify-center items-center">
                <p className=" text-green-500"><BriefcaseIcon className="h-12 w-12" /></p>
                <h2 className="text-xl  my-1 font-semibold">Create Your Profile</h2>
                <p className="text-center">Build your digital resume with skills, experience, and preferences.</p>
                </div>



            </div>
        </div>
    );
};

export default HowItWorks;