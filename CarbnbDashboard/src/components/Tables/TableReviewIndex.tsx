import { useEffect, useState } from 'react';
import { BASE_URL, MAIN_URL, PerPage } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface Review {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  reservation: string;
  rating: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const TableReviewIndex = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PerPage;

  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);
  const [averageStar, setAverageStar] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reviews/index`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Error: Incorrect data');
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));

        let oneS = 0;
        let twoS = 0;
        let threeS = 0;
        let fourS = 0;
        let fiveS = 0;
        let totalRating = 0;

        data.forEach((review: Review) => {
          if (review.rating == '1') oneS++;
          if (review.rating == '2') twoS++;
          if (review.rating == '3') threeS++;
          if (review.rating == '4') fourS++;
          if (review.rating == '5') fiveS++;

          const rating = parseInt(review.rating, 10);
          totalRating += rating;
        });

        setOneStar(oneS);
        setTwoStar(twoS);
        setThreeStar(threeS);
        setFourStar(fourS);
        setFiveStar(fiveS);

        const average = data.length > 0 ? (totalRating / data.length).toFixed(2) : 0;
        setAverageStar(Number(average));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  if (isLoading) {
    return (
      <div className="display-loading">
        <div>Data loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="display-error">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-7">
        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-warning flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current -m-1">
              <path d="M11.1034 3.81714C11.4703 3.07397 12.53 3.07397 12.8968 3.81714L14.8577 7.7896C15.0032 8.08445 15.2844 8.28891 15.6098 8.33646L19.9964 8.97763C20.8163 9.09747 21.1431 10.1053 20.5495 10.6835L17.3769 13.7735C17.1411 14.0033 17.0334 14.3344 17.0891 14.6589L17.8376 19.0231C17.9777 19.8401 17.1201 20.4631 16.3865 20.0773L12.4656 18.0153C12.1742 17.8621 11.8261 17.8621 11.5347 18.0153L7.61377 20.0773C6.88014 20.4631 6.02259 19.8401 6.16271 19.0231L6.91122 14.6589C6.96689 14.3344 6.85922 14.0033 6.62335 13.7735L3.45082 10.6835C2.85722 10.1053 3.18401 9.09747 4.00392 8.97763L8.39051 8.33646C8.71586 8.28891 8.99704 8.08445 9.14258 7.7896L11.1034 3.81714Z"></path>
            </svg>
            {formatPrice(averageStar)}</p>
          <p className="text-slate-500 mt-2.5">Average stars</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(oneStar)}</p>
          <p className="text-slate-500 mt-2.5">1 star</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(twoStar)}</p>
          <p className="text-slate-500 mt-2.5">2 stars</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(threeStar)}</p>
          <p className="text-slate-500 mt-2.5">3 stars</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(fourStar)}</p>
          <p className="text-slate-500 mt-2.5">4 stars</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(fiveStar)}</p>
          <p className="text-slate-500 mt-2.5">5 stars</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="border-b-2 py-5 px-4 sm:pl-6 lg:pl-10 lg:pr-6">
          <h4 className="text-lg font-bold text-black">List of Reviews</h4>
        </div>

        {reviews.length === 0 ? (
          <div className="max-w-full py-40 px-4 text-center">
            <p>No data found</p>
          </div>
        ) : (
          <div>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto table-border">
                <thead>
                  <tr className="bg-gray-2 text-left border-b">
                    <th className="w-[20%] py-4 px-4 font-medium text-black sm:pl-6 lg:pl-10">
                      Customer
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Reservation ID
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Rating
                    </th>
                    <th className="w-[30%] py-4 px-4 font-medium text-black">
                      Comment
                    </th>
                    <th className="w-[20%] py-4 px-4 font-medium text-black">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentReviews.map((review, key) => (
                  <tr key={key} className="hover:bg-gray-100">
                    <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">
                      <NavLink
                        to={`${MAIN_URL}/user/${review.username}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        target="_blank"
                      >
                        <p>{review.firstName} {review.lastName}</p>
                      </NavLink>
                    </td>
                    <td className="border-b py-5 px-4">
                      <NavLink
                        to={`/reservations/${review.reservation}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <p>#{review.reservation}</p>
                      </NavLink>
                    </td>
                    <td className="border-b py-5 px-4">
                        <div className="inline-flex items-center gap-2.5 rounded-full bg-opacity-10 py-1.5 px-5 text-warning bg-warning">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current -m-1">
                            <path d="M11.1034 3.81714C11.4703 3.07397 12.53 3.07397 12.8968 3.81714L14.8577 7.7896C15.0032 8.08445 15.2844 8.28891 15.6098 8.33646L19.9964 8.97763C20.8163 9.09747 21.1431 10.1053 20.5495 10.6835L17.3769 13.7735C17.1411 14.0033 17.0334 14.3344 17.0891 14.6589L17.8376 19.0231C17.9777 19.8401 17.1201 20.4631 16.3865 20.0773L12.4656 18.0153C12.1742 17.8621 11.8261 17.8621 11.5347 18.0153L7.61377 20.0773C6.88014 20.4631 6.02259 19.8401 6.16271 19.0231L6.91122 14.6589C6.96689 14.3344 6.85922 14.0033 6.62335 13.7735L3.45082 10.6835C2.85722 10.1053 3.18401 9.09747 4.00392 8.97763L8.39051 8.33646C8.71586 8.28891 8.99704 8.08445 9.14258 7.7896L11.1034 3.81714Z"></path>
                          </svg>
                          <p className="font-semibold">{review.rating}</p>
                        </div>
                    </td>
                    <td className="border-b py-5 px-4">
                      <p>{review.comment}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                      <p>{formatDateTime(review.createdAt)}</p>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm ${currentPage === 1 ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, reviews.length)} of{' '} {reviews.length} results
                </p>
                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 ${currentPage === 1 ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      onClick={() => handlePageChange(pageIndex + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${currentPage === pageIndex + 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableReviewIndex;