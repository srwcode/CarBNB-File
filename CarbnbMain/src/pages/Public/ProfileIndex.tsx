import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { BASE_URL, DEFAULT_IMAGE } from '../../config.js';
import { format, parseISO } from 'date-fns';
import { Phone } from 'lucide-react';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  phoneNumber: string;
}

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
}

interface Reservation {
  id: string;
}

const ProfileIndex = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('spots');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/users/show/${username}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        throw new Error('An unknown error occurred');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/spots/user/${username}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSpots(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        throw new Error('An unknown error occurred');
      }
    };

    fetchSpots();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/schedules/user/${username}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSchedules(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        throw new Error('An unknown error occurred');
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/reservations/user/${username}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        throw new Error('An unknown error occurred');
      }
    };

    fetchReservations();
  }, []);

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  if (!user) {
    return;
  }

  return (
    <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5">
      <div className="flex justify-center drop-shadow-2">
        {user.imagePath ? (
        <img
          className="profile-page-image rounded-full w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem]"
          src={`${BASE_URL}/${user.imagePath}`}
          alt={`${user.username} image`}
        />
        ) : (
        <img
          className="rounded-full w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem]"
          src={`https://ui-avatars.com/api/?name=${user.firstName} ${user.lastName}&font-size=0.35&size=128&color=random&background=random&format=svg`} 
          alt={`${user.username} image`}
        />
        )}
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-2xl font-semibold text-black">
          {user.firstName} {user.lastName}
        </h3>

        <p className="font-medium mt-2">@{user.username}</p>

        {user.phoneNumber && (
          <div className="flex justify-center items-center gap-2.5 mt-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <p>{user.phoneNumber}</p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-6 mb-8 grid max-w-[40rem] grid-rows-3 2xsm:grid-rows-1 2xsm:grid-cols-3  py-2.5">
        <div className="flex flex-col items-center justify-center gap-1.5 2xsm:border-r-2 border-stroke px-4 py-2">
          <span className="font-semibold text-black 2xsm:text-lg">
            {formatPrice(spots.length.toString())}
          </span>
          <span>Parking Spots</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 2xsm:border-r-2 border-stroke px-4 py-2">
          <span className="font-semibold text-black 2xsm:text-lg">
            {formatPrice(schedules.length.toString())}
          </span>
          <span>Schedules</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-2">
          <span className="font-semibold text-black 2xsm:text-lg">
            {formatPrice(reservations.length.toString())}
          </span>
          <span>Reservations</span>
        </div>
      </div>

      <div className="mx-auto mb-6 flex justify-center max-w-[40rem] gap-4 border-b-[3px] text-center border-stroke sm:gap-6">
        <a
          className={`border-b-[3px] w-6/12 py-4 -mb-[2px] text-sm font-medium cursor-pointer md:text-base lg:text-lg ${activeTab === 'spots' ? 'text-[#557df4] border-[#557df4]' : 'text-slate-500 border-transparent hover:border-slate-300'}`}
          onClick={() => setActiveTab('spots')}
        >
          Parking Spots
        </a>
        <a
          className={`border-b-[3px] w-6/12 py-4 -mb-[2px] text-sm font-medium cursor-pointer md:text-base lg:text-lg ${activeTab === 'schedules' ? 'text-[#557df4] border-[#557df4]' : 'text-slate-500 border-transparent hover:border-slate-300'}`}
          onClick={() => setActiveTab('schedules')}
        >
          Schedules
        </a>
      </div>

      <div className="tab-content mx-auto max-w-[40rem]">
        {activeTab === 'spots' && (
          <div className="spots-content">
            {spots.length === 0 ? (
              <div className="max-w-full py-12 px-4 text-center">
                <p>No parking spot found</p>
              </div>
            ) : (
              <>
                {spots.map((spot, key) => (
                  <div key={key} className="w-full rounded-lg border border-stroke bg-white shadow-default hover:bg-gray-100 px-8 py-6 mt-6">
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
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {activeTab === 'schedules' && (
          <div className="schedules-content">
            {schedules.length === 0 ? (
              <div className="max-w-full py-12 px-4 text-center">
                <p>No schedule found</p>
              </div>
            ) : (
              <>
                {schedules.map((schedule, key) => (
                  <div key={key} className="w-full rounded-lg border border-stroke bg-white shadow-default hover:bg-gray-100 px-8 py-6 mt-6">
                    <NavLink to={`/schedule/${schedule.id}`} className="flex gap-5">
                      {schedule.spotImagePath ? (
                      <img
                        className="schedule-image"
                        src={`${BASE_URL}/${schedule.spotImagePath}`}
                        alt={`${schedule.spotName} image`}
                      />
                      ) : (
                      <img
                        className="schedule-image"
                        src={`${DEFAULT_IMAGE}`} 
                        alt="Default image"
                      />
                      )}
                      <div>
                        
                        <p
                          className="max-w-[40vw] truncate overflow-hidden hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.location.href = `/spot/${schedule.spot}`;
                          }}
                        >
                          {schedule.spotName}
                        </p>
                        <h5 className="max-w-[24vw] truncate overflow-hidden font-medium text-black mt-1.5">Start: {formatDateTime(schedule.startDateTime)}</h5>
                        <h5 className="max-w-[24vw] truncate overflow-hidden font-medium text-black mt-1">End: {formatDateTime(schedule.endDateTime)}</h5>
                        
                        <p className="mt-1.5"><span className="font-bold text-base text-[#557df4]">฿{formatPrice(schedule.pricePerHour)}</span>/hr</p>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ProfileIndex;
