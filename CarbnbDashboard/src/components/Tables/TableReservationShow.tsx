import { useEffect, useState } from 'react';
import { BASE_URL, MAIN_URL } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
}

const TableReservationShow = ({ showId = "" }) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reservations/show/${showId}`, {
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
        setReservation(data);
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

  if (!reservation) {
    return (
      <div className="display-empty">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b-2 py-5 px-6 lg:px-10">
        <h4 className="text-lg font-bold text-black">Reservation: #{reservation.id}</h4>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
              <tr className="hover:bg-gray-100">
                <td className="w-6/12 border-b py-5 px-6 lg:px-10">
                  <p>Reservation Date</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>{formatDateTime(reservation.createdAt)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Schedule</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p><span className="font-semibold">Schedule ID:</span> #{reservation.schedule.id}</p>
                  <p className="mt-4"><span className="font-semibold">Parking Spot:</span> {reservation.spotName}</p>

                  <NavLink
                    to={`/schedules/${reservation.schedule.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <p className="mt-4">More details</p>
                  </NavLink>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Customer</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p><span className="font-semibold">Name:</span> {reservation.user.firstName} {reservation.user.lastName}</p>
                  <p className="mt-4"><span className="font-semibold">Phone Number:</span> {reservation.user.phoneNumber}</p>

                  <NavLink
                    to={`${MAIN_URL}/user/${reservation.user.username}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                    target="_blank"
                  >
                    <p className="mt-4">Customer Profile</p>
                  </NavLink>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Vehicle</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  {reservation.imagePath && (
                    <img
                      className="reservation-show-image mb-6"
                      src={`${BASE_URL}/${reservation.imagePath}`} 
                      alt={`${reservation.vehicleLicensePlate} image`} 
                    />
                  )}
                  <p><span className="font-semibold">License Plate:</span> {reservation.vehicleLicensePlate}</p>
                  <p className="mt-4"><span className="font-semibold">Province:</span> {reservation.vehicleProvince}</p>
                  <p className="mt-4"><span className="font-semibold">Type:</span> {reservation.vehicleType == 'sedan' ? 'Sedan' :
                      reservation.vehicleType == 'coupe' ? 'Coupe' :
                      reservation.vehicleType == 'hatchback' ? 'Hatchback' :
                      reservation.vehicleType == 'crossover' ? 'Crossover' :
                      reservation.vehicleType == 'suv' ? 'SUV' :
                      reservation.vehicleType == 'ppv' ? 'PPV' :
                      reservation.vehicleType == 'pickup' ? 'Pickup' :
                      reservation.vehicleType == 'wagon' ? 'Wagon' :
                      reservation.vehicleType == 'offroad' ? 'Off-road' :
                      reservation.vehicleType == 'sports' ? 'Sports' :
                      reservation.vehicleType == 'micro' ? 'Micro' :
                      reservation.vehicleType == 'van' ? 'Van' :
                      reservation.vehicleType == 'mpv' ? 'MPV' :
                      reservation.vehicleType == 'convertible' ? 'Convertible' :
                      reservation.vehicleType == 'muscle' ? 'Muscle' :
                      reservation.vehicleType == 'limousine' ? 'Limousine' :
                      reservation.vehicleType == 'motorcycle_standard' ? 'Standard (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_cruiser' ? 'Cruiser (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_touring' ? 'Touring (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_sport' ? 'Sport (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_offroad' ? 'Off-road (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_dualpurpose' ? 'Dual-purpose (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_sporttouring' ? 'Sport Touring (Motorcycle)' :
                      reservation.vehicleType == 'motorcycle_scooter' ? 'Scooter (Motorcycle)' :
                      reservation.vehicleType == 'other' ? 'Other' : 'Unknown'}
                  </p>
                  <p className="mt-4"><span className="font-semibold">Brand:</span> {reservation.vehicleBrand}</p>
                  <p className="mt-4"><span className="font-semibold">Model:</span> {reservation.vehicleModel}</p>
                  <p className="mt-4"><span className="font-semibold">Color:</span> {reservation.vehicleColor == 'white' ? 'White' :
                    reservation.vehicleColor == 'black' ? 'Black' :
                    reservation.vehicleColor == 'silver' ? 'Silver' :
                    reservation.vehicleColor == 'red' ? 'Red' :
                    reservation.vehicleColor == 'blue' ? 'Blue' :
                    reservation.vehicleColor == 'grey' ? 'Grey' :
                    reservation.vehicleColor == 'green' ? 'Green' :
                    reservation.vehicleColor == 'yellow' ? 'Yellow' :
                    reservation.vehicleColor == 'orange' ? 'Orange' :
                    reservation.vehicleColor == 'brown' ? 'Brown' :
                    reservation.vehicleColor == 'purple' ? 'Purple' :
                    reservation.vehicleColor == 'pink' ? 'Pink' :
                    reservation.vehicleColor == 'beige' ? 'Beige' :
                    reservation.vehicleColor == 'gold' ? 'Gold' :
                    reservation.vehicleColor == 'champagne' ? 'Champagne' :
                    reservation.vehicleColor == 'maroon' ? 'Maroon' :
                    reservation.vehicleColor == 'turquoise' ? 'Turquoise' :
                    reservation.vehicleColor == 'other' ? 'Other' : 'Unknown'}
                  </p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Duration</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p><span className="font-semibold">Start Date and Time:</span> {formatDateTime(reservation.startDateTime)}</p>
                  <p className="mt-4"><span className="font-semibold">End Date and Time:</span> {formatDateTime(reservation.endDateTime)}</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border-b py-5 px-6 lg:px-10">
                  <p>Price</p>
                </td>
                <td className="border-b py-5 px-6 lg:px-10">
                  <p><span className="font-semibold">Total Price:</span> {reservation.amount != null ? '฿' + formatPrice(reservation.amount) : 'None'}</p>
                  <p className="mt-4"><span className="font-semibold">Price Per Hour:</span> ฿{reservation.schedule.pricePerHour}</p>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableReservationShow;