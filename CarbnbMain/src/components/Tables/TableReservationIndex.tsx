import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE, PerPage } from '../../config.js';
import { format, parseISO } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { Navigation } from 'lucide-react';

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

interface Schedule {
  id: string;
  pricePerHour: string;
}

interface Reservation {
  id: string;
  status: string;
  user: User;
  schedule: Schedule;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
  amount: string;
  
  imagePath: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  vehicleProvince: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  
  spotName: string;
  spotLocation: string;
  spotImagePath: string;
}

const TableReservationIndex = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
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
        
        const response = await fetch(`${BASE_URL}/member/reservations/list`, {
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
        setReservations(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));

        let upcoming = 0;
        let completed = 0;
        let canceled = 0;
        let earnings = 0;

        data.forEach((reservation: Reservation) => {
          if (reservation.status == '1') upcoming++;
          if (reservation.status == '2') completed++;
          if (reservation.status == '3') canceled++;

          if (reservation.status != '3' && reservation.amount) {
            earnings += parseFloat(reservation.amount);
          }
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = reservations.slice(startIndex, startIndex + itemsPerPage);

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
      {reservations.length === 0 ? (
        <div className="max-w-full py-40 px-4 text-center">
          <p>No reservation found</p>
        </div>
      ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 mt-8 mb-8">
              {currentReservations.map((reservation, key) => (
                <div key={key} className="w-full rounded-lg border border-stroke bg-white shadow-default hover:bg-gray-100">
                  <NavLink to={`/reservations/${reservation.id}`}>
                    <div className="flex justify-between items-center border-b py-4">
                      <h3 className="text-lg font-medium text-black ml-8">Reservation #{reservation.id}</h3>
                    
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-4 mr-6 text-sm font-medium ${
                          reservation.status == '1' ? 'bg-warning text-warning'
                          : reservation.status == '2' ? 'bg-success text-success'
                          : reservation.status == '3' ? 'bg-danger text-danger'
                          : 'bg-black text-white'
                        }`}
                      >
                        {reservation.status == '1' ? 'Upcoming'
                        : reservation.status == '2' ? 'Completed'
                        : reservation.status == '3' ? 'Canceled'
                        : 'None'}
                      </p>
                    </div>

                    <div className="flex gap-5 py-6 px-8">
                      {reservation.spotImagePath ? (
                      <img
                        className="list-reservation-image"
                        src={`${BASE_URL}/${reservation.spotImagePath}`}
                        alt={`${reservation.spotName} image`}
                      />
                      ) : (
                      <img
                        className="list-reservation-image"
                        src={`${DEFAULT_IMAGE}`} 
                        alt="Default image"
                      />
                      )}
                      <div>
                        
                        <p
                          className="max-w-[40vw] truncate overflow-hidden text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.location.href = `/schedule/${reservation.schedule.id}`;
                          }}
                        >
                          {reservation.spotName}
                        </p>
                        <h5 className="max-w-[25vw] truncate overflow-hidden font-medium text-black mt-2">Start: {formatDateTime(reservation.startDateTime)}</h5>
                        <h5 className="max-w-[25vw] truncate overflow-hidden font-medium text-black mt-1.5">End: {formatDateTime(reservation.endDateTime)}</h5>
                        
                        <p className="mt-2">Price: ฿{formatPrice(reservation.amount)}</p>
                        <p className="mt-1">{reservation.vehicleBrand} {reservation.vehicleModel} ({reservation.vehicleLicensePlate})</p>
                      </div>
                    </div>
                  </NavLink>

                  <div className="flex justify-between items-center border-t py-4">
                    <NavLink
                      to={reservation.spotLocation}
                      className="flex items-center gap-2 mx-8 text-blue-600 hover:text-blue-800 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Directions to this Parking</span>
                    </NavLink>
                  </div>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, reservations.length)} of{' '} {reservations.length} results
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
          </>
        )}
    </>
  );
};

export default TableReservationIndex;