import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, CreditCard, MapPin, CarFront,  Navigation, SquareParking, User, Phone, Star, Pencil, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface Users {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Schedule {
  id: string;
  pricePerHour: string;
  user: Users;
}

interface Reservation {
  id: string;
  status: string;
  user: Users;
  schedule: Schedule;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
  amount: string;
  method: string;

  imagePath: string;

  vehicle: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  vehicleProvince: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;

  spotId: string;
  spotName: string;
  spotType: string;
  spotLocation: string;
  spotAddress: string;
  spotSizeWidth: string;
  spotSizeLength: string;
  spotSizeHeight: string;
  spotImagePath: string;
  spotLatitude: string;
  spotLongitude: string;

  reviewId: string;
  reviewRating: string;
  reviewComment: string;
}

const TableReservationShow = ({ showId = "" }) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reservations/list/show/${showId}`, {
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

  const handleDelete = async () => {

    const isConfirmed = window.confirm('Are you sure you want to cancel?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/member/reservations/remove/${showId}`, {
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
          navigate('/reservations');
          toast.success('Canceled successfully');
        } else {
          toast.error('Failed to Cancel');
        }
      } else {
        throw new Error(`Failed to cancel. Status: ${response.status}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
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
    <div className="max-w-[50rem] mx-auto">
      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Reservation #{reservation.id}
          </h1>
          <span 
            className={`px-4 py-2 rounded-full bg-opacity-10 text-sm font-medium ${
              reservation.status == '1' ? 'bg-warning text-warning'
              : reservation.status == '2' ? 'bg-success text-success'
              : reservation.status == '3' ? 'bg-danger text-danger'
              : 'bg-black text-white'
          }`}>
            {reservation.status == '1' ? 'Upcoming'
            : reservation.status == '2' ? 'Completed'
            : reservation.status == '3' ? 'Canceled'
            : 'None'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Reservation Date</p>
              <p className="text-sm text-gray-900">{formatDateTime(reservation.createdAt)}</p>
            </div>
          </div>
        
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="text-sm text-gray-900">{formatDateTime(reservation.startDateTime)} - {formatDateTime(reservation.endDateTime)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CarFront className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Details</h2>
          </div>
          
          <NavLink
            to={`/reservations/${reservation.id}/edit`}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm">Change vehicle</span>
          </NavLink>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Brand / Model</p>
            <p className="text-gray-900">{reservation.vehicleBrand} {reservation.vehicleModel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">License Plate</p>
            <p className="text-gray-900">{reservation.vehicleLicensePlate} ({reservation.vehicleProvince})</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Location Details</h2>
        </div>

        {reservation.spotLatitude && reservation.spotLongitude && (
        <div className="rounded-lg overflow-hidden mb-6">
          <iframe
            src={`http://maps.google.com/maps?q=${reservation.spotLatitude},${reservation.spotLongitude}&z=16&output=embed`}
            height="450"
            width="100%"
            style={{ border: "0", marginTop: "-150px" }}
          >
          </iframe>
        </div>
        )}
        
        <p className="text-gray-500 mb-4">
          <span className="font-semibold">Address: </span>
          {reservation.spotAddress}
        </p>

        <NavLink
          to={reservation.spotLocation}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation className="w-4 h-4" />
          <span>Directions to this Parking</span>
        </NavLink>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <SquareParking className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Parking Spot Details</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          <div>
            {reservation.spotImagePath && (
              <img
                className="w-full sm:w-[280px] reservation-show-image"
                src={`${BASE_URL}/${reservation.spotImagePath}`} 
                alt={`${reservation.spotName} image`} 
              />
            )}
          </div>
          <div>
            <p className="text-gray-900 font-semibold truncate">{reservation.spotName}</p>

            <p className="text-gray-500 mt-4">
              <span className="font-semibold">Type: </span>
              {reservation.spotType == '1' ? 'Indoor' : reservation.spotType == '2' ? 'Outdoor' : 'None'}
            </p>

            <p className="text-gray-500 mt-4">
              <span className="font-semibold">Size: </span>
              {reservation.spotSizeHeight ?
                <>
                  {reservation.spotSizeWidth}x{reservation.spotSizeLength}x{reservation.spotSizeHeight}m<sup>3</sup>
                </>
              :
                <>
                  {reservation.spotSizeWidth}x{reservation.spotSizeLength}m<sup>2</sup>
                </>
              }
            </p>

            <p className="text-gray-500 mt-4">
              <span className="font-semibold">Schedule: </span>
              <NavLink
                to={`/schedule/${reservation.schedule.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
                target="_blank"
              >
                <span className="cursor-pointer">#{reservation.schedule.id}</span>
              </NavLink>
            </p>

            <p className="text-gray-900 font-semibold mt-6">Owner</p>

            <div className="flex items-center gap-2.5 mt-4">
              <User className="w-5 h-5 text-gray-400" />
              <NavLink
                to={`/user/${reservation.schedule.user.username}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
                target="_blank"
              >
                <p className="cursor-pointer">{reservation.schedule.user.firstName} {reservation.schedule.user.lastName}</p>
              </NavLink>
            </div>

            <div className="flex items-center gap-2.5 mt-4">
              <Phone className="w-5 h-5 text-gray-400" />
              <p>{reservation.schedule.user.phoneNumber}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <p className="text-gray-900">฿{formatPrice(reservation.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Method</p>
            <p className="text-gray-900">{reservation.method}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-stroke p-6 pt-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">My Review</h2>
          </div>

          {reservation.reviewId && (
          <NavLink
            to={`/reservations/${reservation.id}/review`}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm">Edit review</span>
          </NavLink>
          )}
        </div>

        {reservation.reviewId ?
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rating</p>
              {reservation.reviewRating ?
                <>
                  <p className="text-warning font-medium flex items-center gap-1.5">
                    <Star fill="#ffa70b" className="w-4 h-4" />
                    <span>{reservation.reviewRating}</span>
                  </p>
                </>
              :
                <>
                  <p className="text-gray-900">-</p>
                </>
              }
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Comment</p>
              <p className="text-gray-900">
                {reservation.reviewComment ? reservation.reviewComment : '-'}
              </p>
            </div>
          </div>
        :
          <NavLink
            to={`/reservations/${reservation.id}/review`}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add review</span>
          </NavLink>
        }
      </div>

      {reservation.status == '1' ? (
      <button
        className="flex justify-center rounded-full border border-red-500 py-3 px-12 mt-10 font-medium text-red-500 hover:bg-red-50"
        onClick={(e) => { 
          e.preventDefault();
          handleDelete();
        }}
      >
        Cancel
      </button>
      ) : null}
    </div>
  );
};

export default TableReservationShow;