import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface Schedule {
  id: string;
  spot: string;
  spotName: string;
  spotImagePath: string;
  pricePerHour: string;
  minimumHour: string;
  charger: string;
  chargerPrice: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}

const TableScheduleShow = ({ showId = "" }) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/schedules/show/${showId}`, {
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
        setSchedule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMMM yyyy | HH:mm");
  };

  const formatPrice = (price: string) => {
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

  if (!schedule) {
    return (
      <div className="display-empty">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b-2 py-5 px-6 lg:px-10">
        <h4 className="text-lg font-bold text-black">Schedule: #{schedule.id}</h4>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
              <tr className="hover:bg-gray-100">
                <td className="w-6/12 border-b py-5 px-6 lg:px-10">
                  <p>Parking Spot</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <NavLink
                    to={`/spots/${schedule.spot}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <p>{schedule.spotName}</p>
                  </NavLink>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Start Date and Time</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(schedule.startDateTime)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>End Date and Time</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(schedule.endDateTime)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Price Per Hour</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>฿{formatPrice(schedule.pricePerHour)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Minimum Hour</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{schedule.minimumHour != null ? schedule.minimumHour + ' hours' : '1 hour'}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Charger</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{schedule.charger != null ? 'Yes' : 'No'}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Charger Price Per Hour</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{schedule.chargerPrice != null ? '฿' + formatPrice(schedule.chargerPrice) : null}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Description</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{schedule.description}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Created</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(schedule.createdAt)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Updated</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(schedule.updatedAt)}</p>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableScheduleShow;