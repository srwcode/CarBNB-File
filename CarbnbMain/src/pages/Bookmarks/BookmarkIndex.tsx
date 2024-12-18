import { useEffect, useState } from 'react';
import { BASE_URL, PerPage, DEFAULT_IMAGE } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface Spot {
  spotId: string;
  name: string;
  type: string;
  location: string;
  address: string;
  description: string;
  sizeWidth: string;
  sizeLength: string;
  sizeHeight: string;
  imagePath: string;
  latitude: string;
  longitude: string;

  user: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userImagePath: string;
}

const BookmarkIndex = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = PerPage;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await fetch(`${BASE_URL}/member/spots/bookmark`, {
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
          setSpots(data);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred loading data.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);


    const handleBookmark = async (id: string) => {
      try {
        const response = await fetch(`${BASE_URL}/member/bookmarks/spot/update/${id}`, {
          method: "POST",
          credentials: 'include'
        });
  
        if (response.ok) {
          const updated = await response.json();
  
          if (updated == 1) {
            toast.success('Bookmark added successfully');
          } else if (updated === 2) {
            toast.success('Bookmark removed successfully');
            setSpots(prevSpots => prevSpots.filter(spot => spot.spotId !== id));
          } else {
            toast.error('Failed to update');
          }
        } else {
          console.error("Failed to update:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSpots = spots.slice(startIndex, startIndex + itemsPerPage);
  
    const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
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
      <div className="max-w-[50rem] mx-auto">
        <h2 className="text-title-md2 font-semibold text-black mb-8">My Bookmarks</h2>

        {spots.length === 0 ? (
          <div className="max-w-full py-40 px-4 text-center">
            <p>No data found</p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              {currentSpots.map((spot, key) => (
                <div key={key} className="relative w-full rounded-lg border border-stroke bg-white shadow-default hover:bg-gray-100 px-8 py-6 mt-6">
                  <NavLink to={`/spot/${spot.spotId}`} className="flex gap-5">
                    {spot.imagePath ? (
                    <img
                      className="spot-image"
                      src={`${BASE_URL}/${spot.imagePath}`}
                      alt={`${spot.name} image`}
                    />
                    ) : (
                    <img
                      className="spot-image"
                      src={`${DEFAULT_IMAGE}`} 
                      alt="Default image"
                    />
                    )}
                    <div>
                      <h5 className="max-w-[24vw] truncate overflow-hidden text-lg font-medium text-black">{spot.name}</h5>
                      <p
                        className="max-w-[24vw] truncate overflow-hidden mt-1 text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          window.open(spot.location, '_blank');
                        }}
                      >
                        {spot.address}
                      </p>
                      <p className="mt-1">{spot.type == '1' ? 'Indoor' : spot.type == '2' ? 'Outdoor' : 'None'}</p>
                      <p className="mt-1">{spot.sizeWidth}x{spot.sizeLength} m<sup>2</sup></p>
                    </div>
                  </NavLink>

                  <button className="absolute invisible xl:visible top-5 right-6" onClick={() => handleBookmark(spot.spotId)}>
                    <X className="w-6 h-6 text-gray-400 hover:text-gray-600"/>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-4">
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
                <p className="text-sm lg:text-base text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, spots.length)} of{' '} {spots.length} results
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
                      className={`relative inline-flex items-center px-4 py-2 text-gray-900 text-sm ring-1 ring-inset ring-gray-300 ${currentPage === pageIndex + 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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

export default BookmarkIndex;
