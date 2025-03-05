import { Link } from "react-router-dom";

const Unauthorized = () => {



    return (
        <div className="text-center mt-20">
            <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
            <p className="my-4 text-lg">You do not have permission to access this page. Please Login and access  your dashboard</p>
            <Link to='/'
              
                className="text-white  bg-blue-500 hover:bg-blue-600 cursor-pointer px-4 py-2 rounded-md mt-5 transition duration-300"
            >
                Go To Home
            </Link>
        </div>
    );
};

export default Unauthorized;