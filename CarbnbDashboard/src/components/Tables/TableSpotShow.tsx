import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface Spot {
  id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  description: string;
  sizeWidth: string;
  sizeLength: string;
  sizeHeight: string;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
}

const TableSpotShow = ({ showId = "" }) => {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/spots/show/${showId}`, {
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
        setSpot(data);
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

  if (!spot) {
    return (
      <div className="display-empty">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b-2 py-5 px-6 lg:px-10">
        <h4 className="text-lg font-bold text-black">Parking Spot: {spot.name}</h4>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
              <tr className="hover:bg-gray-100">
                <td className="w-6/12 border-b py-5 px-6 lg:px-10">
                  <p>Address</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.address}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Location</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <NavLink
                    to={spot.location}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p>Google Maps</p>
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
                      <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
                    </svg>
                  </NavLink>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Type</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.type == '1' ? 'Indoor' : spot.type == '2' ? 'Outdoor' : 'None'}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Width</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.sizeWidth} m</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Length</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.sizeLength} m</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Height</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.sizeHeight != null ? spot.sizeHeight + ' m' : ''}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Description</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{spot.description}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Image</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  {spot.imagePath && (
                    <img
                      className="spot-show-image"
                      src={`${BASE_URL}/${spot.imagePath}`} 
                      alt={`${spot.name} image`} 
                    />
                  )}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Created</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(spot.createdAt)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Updated</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(spot.updatedAt)}</p>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSpotShow;