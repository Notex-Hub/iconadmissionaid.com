import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/Home/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    { name: "Home", to: "/" },
    { name: "Courses", to: "/courses" },
    { name: "Books", to: "/books" },
    { name: "Free Class", to: "/free-class" },
    { name: "Free Test", to: "/free-test" },
    { name: "Paid Test", to: "/paid-test" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com" },
    { icon: FaInstagram, href: "https://instagram.com" },
    { icon: FaLinkedinIn, href: "https://linkedin.com" },
    { icon: FaXTwitter, href: "https://twitter.com" },
    { icon: FaYoutube, href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-[#0A0A10] text-gray-200 pt-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 pb-12">
          {/* লোগো এবং সোশ্যাল আইকন */}
          <div className="flex flex-col space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="ICON Admission Aid" className="h-8" />
              <span className="text-xl font-bold">ICON</span>
            </div>
            <p className="text-sm font-medium">আমাদের সাথে যুক্ত থাকুন</p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-500 rounded-full hover:bg-red-600 transition duration-300"
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* প্রয়োজনীয় লিংক */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white border-b border-red-600 pb-1 inline-block">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-3 text-sm">
              {links.map(({ name, to }, index) => (
                <li key={index}>
                  <Link
                    to={to}
                    className="hover:text-red-600 transition duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* যোগাযোগ */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white border-b border-red-600 pb-1 inline-block">
              যোগাযোগ
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-red-600" />
                <p>+8801799-056414</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-red-600" />
                <p>iconadmissionaid@gmail.com</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-red-600" />
                <p>+8801799-056414</p>
              </div>
            </div>
          </div>

          {/* কোম্পানির তথ্য */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white border-b border-red-600 pb-1 inline-block">
              কোম্পানির তথ্য
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-red-600 mt-1" />
                <p className="leading-relaxed">
                  Address : Block A <br />
                  Bashundhara R/A, Dhaka <br />
                  Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* নিচের লিঙ্ক */}
        <hr className="border-gray-700" />
        <div className="flex flex-col md:flex-row justify-center items-center py-5 space-y-2 md:space-y-0 text-sm font-medium">
          <Link
            to="/"
            className="px-4 hover:text-red-600 transition duration-300"
          >
            Terms & Conditions
          </Link>
          <span className="hidden md:inline border-r border-gray-500 h-4"></span>
          <Link
            to="/"
            className="px-4 hover:text-red-600 transition duration-300"
          >
            Privacy Policy
          </Link>
          <span className="hidden md:inline border-r border-gray-500 h-4"></span>
          <Link
            to="/"
            className="px-4 hover:text-red-600 transition duration-300"
          >
            Refund Policy
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-3 bg-[#000000]">
        &copy; {new Date().getFullYear()} ICON Admission Aid. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
