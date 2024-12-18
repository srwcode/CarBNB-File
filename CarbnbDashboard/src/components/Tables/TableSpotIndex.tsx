import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE, PerPage } from '../../config.js';
import { NavLink } from 'react-router-dom';
import DropdownDefault from '../Dropdowns/DropdownDefault.js';
import { toast } from 'react-toastify';

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
}

const TableSpotIndex = () => {
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
        
        const response = await fetch(`${BASE_URL}/member/spots/index`, {
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpots = spots.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id: string) => {

    const isConfirmed = window.confirm('Are you sure you want to delete?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/member/spots/remove/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result) {
          const updatedSpots = spots.filter(spot => spot.spotId !== id);
          setSpots(updatedSpots);

          const newTotalPages = Math.ceil(updatedSpots.length / itemsPerPage);
          setTotalPages(newTotalPages);

          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
          }
          
          toast.success('Deleted successfully');
        } else {
          toast.error('Failed to delete');
        }
      } else {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
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
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b-2 py-5 px-4 sm:pl-6 lg:pl-10 lg:pr-6">
        <div className="flex justify-between items-center gap-2">
          <h4 className="text-lg font-bold text-black">List of Parking Spots</h4>

          <NavLink
            to="/spots/create"
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 px-6 -my-0.5 text-sm text-center font-medium text-gray-900 hover:bg-gray-50"
          >
            <svg className="fill-current" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"></path>
            </svg>
            Add
          </NavLink>
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="max-w-full py-40 px-4 text-center">
          <p>No data found</p>
        </div>
      ) : (
        <div>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto table-border">
              <tbody>
              {currentSpots.map((spot, key) => (
                <tr key={key} className="hover:bg-gray-100">
                  <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">
                    <NavLink to={`${spot.spotId}`} className="flex gap-5">
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
                        <h5 className="max-w-[40vw] truncate overflow-hidden text-lg font-medium text-black">{spot.name}</h5>
                        <p
                          className="max-w-[40vw] truncate overflow-hidden mt-1 text-blue-600 hover:text-blue-800 hover:underline"
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
                  </td>
                  <td className="border-b py-5 pr-6 sm:pr-8 lg:pr-10">
                    <div className="flex items-center justify-end">
                      <DropdownDefault editHref={`${spot.spotId}/edit`} onDelete={() => handleDelete(spot.spotId)}/>
                    </div>
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
  );
};

export default TableSpotIndex;