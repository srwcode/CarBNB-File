import { useEffect, useState } from 'react';
import { BASE_URL, PerPage } from '../../config.js';
import { format, parseISO } from 'date-fns';

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

interface Schedule {
  id: string;
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

  vehicleType: string;
  vehicleLicensePlate: string;
  vehicleProvince: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  spotName: string;
}

const TableReservationIndex = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PerPage;

  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reservations/index`, {
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

        setUpcomingCount(upcoming);
        setCompletedCount(completed);
        setCanceledCount(canceled);
        setTotalEarnings(earnings);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-7">
        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(upcomingCount)}</p>
          <p className="text-slate-500 mt-2.5">Upcoming Reservation</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(completedCount)}</p>
          <p className="text-slate-500 mt-2.5">Completed Reservation</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(canceledCount)}</p>
          <p className="text-slate-500 mt-2.5">Canceled Reservation</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(totalEarnings)}</p>
          <p className="text-slate-500 mt-2.5">Total Earnings</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="border-b-2 py-5 px-4 sm:pl-6 lg:pl-10 lg:pr-6">
          <h4 className="text-lg font-bold text-black">List of Reservations</h4>
        </div>

        {reservations.length === 0 ? (
          <div className="max-w-full py-40 px-4 text-center">
            <p>No data found</p>
          </div>
        ) : (
          <div>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto table-border">
                <thead>
                  <tr className="bg-gray-2 text-left border-b">
                    <th className="w-[21%] py-4 px-4 font-medium text-black sm:pl-6 lg:pl-10">
                      Reservation ID
                    </th>
                    <th className="w-[12%] py-4 px-4 font-medium text-black">
                      Status
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Customer
                    </th>
                    <th className="w-[20%] py-4 px-4 font-medium text-black">
                      Schedule
                    </th>
                    <th className="w-[20%] py-4 px-4 font-medium text-black">
                      Duration
                    </th>
                    <th className="w-[12%] py-4 px-4 font-medium text-black">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentReservations.map((reservation, key) => (
                  <tr
                    key={key}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/reservations/${reservation.id}`;
                    }}
                  >
                    <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">
                      <p className="font-medium text-black">#{reservation.id}</p>
                      <p className="text-sm mt-2">Date: {formatDateTime(reservation.createdAt)}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
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
                    </td>
                    <td className="border-b py-5 px-4">
                      <p className="font-medium text-black">{reservation.user.firstName} {reservation.user.lastName}</p>
                      <p className="text-sm mt-2">Vehicle: {reservation.vehicleLicensePlate}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                      <p className="font-medium text-black">#{reservation.schedule.id}</p>
                      <p className="text-sm mt-2">Parking: {reservation.spotName}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                      <p className="text-sm">{formatDateTime(reservation.startDateTime)} -</p>
                      <p className="text-sm mt-2">{formatDateTime(reservation.endDateTime)}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p>{reservation.amount != null ? '฿' + formatPrice(reservation.amount) : 'None'}</p>
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

export default TableReservationIndex;