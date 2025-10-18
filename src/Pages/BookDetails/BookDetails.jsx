import { Link, useParams } from "react-router-dom";
import { useGetAllBooksQuery } from "../../../redux/Features/Api/books/booksApi";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { FiDownload, FiShare2, FiTag, FiBookOpen } from "react-icons/fi";

const BookDetails = () => {
  const { data, isLoading, isError } = useGetAllBooksQuery();
  const { slug } = useParams();
  const book = data?.data?.find((b) => b.slug === slug);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24">
          <div className="animate-pulse space-y-4 w-full max-w-6xl">
            <div className="h-80 bg-gray-200 rounded-2xl shadow-md" />
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 text-red-600 text-lg">
          অনুরোধ নিয়ে সমস্যা হয়েছে — পরে চেক করো।
        </div>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 text-gray-500 text-lg">
          Book not found!
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 ">
          <nav className="text-sm text-gray-500 mb-8">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:underline cursor-pointer">
              {book.categoryId?.name || "Category"}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{book.title}</span>
          </nav>

          <section className="bg-white rounded-3xl shadow-lg p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-72">
                  <div className="w-full rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={book.coverPhoto || "/placeholder-book.jpg"}
                      alt={book.title}
                      className="w-full h-[400px] "
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {book.categoryId?.name}
                    </span>{" "}
                    • {book.bookType} • {book.stock}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow">
                      ৳{book.offerPrice}
                    </span>
                    {book.offerPrice < book.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{book.price}
                      </span>
                    )}
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {book.pdf ? (
                      <Link
                        to={`/buy/book/${book.slug}`}
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition-all"
                      >
                        <FiDownload /> কিনুন
                      </Link>
                    ) : (
                      <button className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl">
                        <FiBookOpen /> প্রিভিউ নেই
                      </button>
                    )}

                    <button
                      onClick={() =>
                        navigator.share
                          ? navigator.share({
                            title: book.title,
                            url: window.location.href,
                          }).catch(() => { })
                          : alert("Share not supported")
                      }
                      className="inline-flex cursor-pointer items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-100 transition"
                    >
                      <FiShare2 /> শেয়ার করুন
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {book.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="text-sm inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm"
                      >
                        <FiTag /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  বর্ণনা
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.description || "No description available."}
                </p>
              </div>

              {book.pdf && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    PDF প্রিভিউ
                  </h3>
                  <div className="w-full h-[600px] md:h-[500px] overflow-hidden rounded-2xl shadow-md bg-white">
                    <iframe
                      title={`${book.title}-pdf`}
                      src={book.pdf}
                      className="w-full h-full rounded-2xl"
                      frameBorder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-md">
                  <div className="text-sm text-gray-500">মূল্য</div>
                  <div className="text-3xl font-bold text-green-700 mt-1">
                    ৳{book.offerPrice}
                  </div>
                  {book.offerPrice < book.price && (
                    <div className="text-sm text-gray-400 line-through">
                      ৳{book.price}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    <Link  to={`/buy/book/${book.slug}`} className="w-full curpo bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition flex items-center justify-center gap-2">
                      <FiDownload /> কিনুন
                    </Link>
                    {/* <button className="w-full bg-white text-green-600 px-5 py-2.5 rounded-xl shadow hover:bg-green-50 transition">
                      বুকমার্ক
                    </button>
                    <button className="w-full bg-gray-100 text-gray-800 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition">
                      রিপোর্ট সমস্যা
                    </button> */}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-md">
                  <div className="text-sm text-gray-500">বিক্রেতা</div>
                  <div className="mt-2 text-gray-800 font-medium">
                    {book.createdBy?.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {book.createdBy?.role}
                  </div>
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p>স্টক: {book.stock}</p>
                    <p>টাইপ: {book.bookType}</p>
                    <p>ক্যাটাগরি: {book.categoryId?.name}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-md text-sm text-gray-600">
                  <div className="font-medium mb-2 text-gray-800">
                    আরও তথ্য
                  </div>
                  <div className="text-xs">
                    Slug: <span className="font-medium">{book.slug}</span>
                  </div>
                  <div className="text-xs mt-1">
                    Created:{" "}
                    <span className="font-medium">
                      {new Date(book.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </section>


        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookDetails;
