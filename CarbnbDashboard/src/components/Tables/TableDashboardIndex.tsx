import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO, isSameDay } from 'date-fns';
import DatePicker from '../Forms/DatePicker/DatePicker.js';

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
  
  imagePath: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  vehicleProvince: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  spotName: string;
}

const TableDashboardIndex = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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

        let todayC = 0;
        let totalC = 0;
        let todayE = 0;
        let totalE = 0;
        const today = new Date();

        data.forEach((reservation: Reservation) => {

          const reservationDate = new Date(reservation.createdAt);

          if ((reservation.status == '1' ||
              reservation.status == '2' ||
              reservation.status == '3') &&
              reservationDate.toDateString() === today.toDateString()
          ) {
            todayC++;
          }

          if (reservation.status == '1' ||
              reservation.status == '2' ||
              reservation.status == '3'
          ) {
            totalC++;
          }

          if (reservation.status != '3' &&
              reservation.amount &&
              reservationDate.toDateString() === today.toDateString()
          ) {
            todayE += parseFloat(reservation.amount);
          }

          if (reservation.status != '3' && reservation.amount) {
            totalE += parseFloat(reservation.amount);
          }
        });

        setTodayCount(todayC);
        setTotalCount(totalC);
        setTodayEarnings(todayE);
        setTotalEarnings(totalE);

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
    return format(date, "HH:mm");
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const filteredReservations = reservations.filter((reservation) => 
    (selectedDate ? isSameDay(parseISO(reservation.startDateTime), selectedDate) : true) && reservation.status == '1'
  );

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
          <p className="text-title-lg font-bold text-black">{formatPrice(todayCount)}</p>
          <p className="text-slate-500 mt-2.5">Today Reservation</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(todayEarnings)}</p>
          <p className="text-slate-500 mt-2.5">Today Earnings</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">{formatPrice(totalCount)}</p>
          <p className="text-slate-500 mt-2.5">Total Reservation</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(totalEarnings)}</p>
          <p className="text-slate-500 mt-2.5">Total Earnings</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="border-b-2 py-5 px-4 sm:pl-6 lg:pl-10 lg:pr-8">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-lg font-bold text-black">Upcoming Parking ({filteredReservations.length})</h4>

            <DatePicker selected={selectedDate} onChange={handleDateChange} />
          </div>
        </div>
        
        {filteredReservations.length === 0 ? (
          <div className="max-w-full py-40 px-4 text-center">
            <p>No data found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-8 p-8 sm:py-10 sm:px-12 xl:py-12 xl:px-14 mb-4">
            {filteredReservations.map((reservation, key) => (
              <div key={key}>
                <NavLink to={`/reservations/${reservation.id}`}>
                  <div className="bg-gray bg-opacity-50 shadow-default border-2 border-stroke rounded px-8 py-6 hover:bg-opacity-100 text-center">
                    <p className="text-lg font-bold text-black">{reservation.spotName}</p>
                    <p className="text-sm text-slate-500 mt-2.5">{formatDateTime(reservation.startDateTime)} - {formatDateTime(reservation.endDateTime)}</p>

                    <div className="flex justify-center mt-4 mb-5">
                      {reservation.imagePath ? (
                      <img
                        className="dashboard-vehicle-image"
                        src={`${BASE_URL}/${reservation.imagePath}`}
                        alt={`${reservation.vehicleLicensePlate} image`}
                      />
                      ) : (
                      <img
                        className="dashboard-vehicle-image"
                        src={`${DEFAULT_IMAGE}`} 
                        alt="Default image"
                      />
                      )}
                    </div>

                    <p className="text-black font-medium">{reservation.user.firstName} {reservation.user.lastName}</p>
                    <p className="text-slate-500 mt-2.5">{reservation.vehicleLicensePlate} ({reservation.vehicleProvince})</p>
                    <p className="text-slate-500 mt-2.5">{reservation.vehicleBrand} {reservation.vehicleModel} / {reservation.vehicleType == 'sedan' ? 'Sedan' :
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
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TableDashboardIndex;