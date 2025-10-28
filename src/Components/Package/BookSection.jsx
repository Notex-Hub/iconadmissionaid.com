import { useGetAllBooksQuery } from "../../../redux/Features/Api/books/booksApi";
import BookCard from "../Ui/BookCard";
import Button from "../Ui/Button";

const BookSection = () => {
  const { data: booksData, isLoading, isError } = useGetAllBooksQuery();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden shadow-lg transform transition duration-300 p-3 animate-pulse"
          >
            <div className="w-full h-40 bg-gray-200 mb-4" />
            <div className="h-5 bg-gray-200 mb-2 w-3/4 mx-auto" />
            <div className="flex justify-center items-center gap-2 my-3">
              <div className="h-4 bg-gray-200 w-1/4 line-through" />
              <div className="h-6 bg-gray-200 w-1/4" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded" />
              <div className="flex-1 h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <p>Something went wrong!</p>;

  const books = booksData?.data || [];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} course={book} />
        ))}
      </div>
      {books.length === 8 && (
        <div className="flex justify-center items-center my-5">
          <Button text="View All Courses" />
        </div>
      )}
    </div>
  );
};

export default BookSection;
