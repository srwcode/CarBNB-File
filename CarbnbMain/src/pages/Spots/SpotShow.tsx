import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { BASE_URL } from '../../config.js';
import { format, parseISO } from 'date-fns';
import { Bookmark, Share, MapPin, Scaling, CloudSun, Navigation, Phone, BatteryCharging } from 'lucide-react';
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
  latitude: string;
  longitude: string;

  user: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userImagePath: string;
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

const SpotShow = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isBookmark, setIsBookmark] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const response = await fetch(`${BASE_URL}/checkAuth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();

        if(data == true) {
          setCheckAuth(true);
        }
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/spots/display/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSpot(data);
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
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/schedules/spot/${id}`, {
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
    const fetchData = async () => {

      if(checkAuth) {
        try {
          const response = await fetch(`${BASE_URL}/member/bookmarks/spot/show/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });

          const data = await response.json();

          if(data != null) {
            if(data.status == "1") {
              setIsBookmark(true);
            } else {
              setIsBookmark(false);
            }
          }
          
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if(checkAuth) {
      try {
        const response = await fetch(`${BASE_URL}/member/bookmarks/spot/update/${id}`, {
          method: "POST",
          credentials: 'include'
        });

        if (response.ok) {
          const updated = await response.json();

          if(updated == 1) {
            toast.success('Bookmark added successfully');
            setIsBookmark(true);
          } else if (updated === 2) {
            toast.success('Bookmark removed successfully');
            setIsBookmark(false);
          } else {
            toast.error('Failed to update');
          }
        } else {
          console.error("Failed to update:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      window.location.href = `${BASE_URL}/login`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CarBNB',
          text: 'CarBNB',
          url: window.location.href,
        });
      } catch { }
    } else {
      alert('Error sharing');
    }
  };
  

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  if (!spot) {
    return;
  }

  return (
    <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5">
      <h2 className="text-title-md2 font-semibold text-black mb-8 mx-auto max-w-[40rem] text-center">{spot.name}</h2>

      <div className="flex items-center mx-auto max-w-[40rem] mb-8 justify-center">
        <button className="w-[6.5rem]" onClick={handleBookmark}>
          {isBookmark ? (
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-gray-400 hover:text-gray-600 hover:fill-current" fill="#9ca3af"/>
              <span className="font-medium">Saved</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-gray-400 hover:text-gray-600"/>
              <span className="font-medium">Save</span>
            </div>
          )}
        </button>

        <button className="w-[6.5rem]" onClick={handleShare}>
          <div className="flex items-center gap-2.5">
            <Share className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            <span className="font-medium">Share</span>
          </div>
        </button>
      </div>

      <div className="mx-auto mb-6 flex justify-center max-w-[40rem] gap-4 border-b-[3px] text-center border-stroke sm:gap-6">
        <a
          className={`border-b-[3px] w-6/12 py-4 -mb-[2px] text-sm font-medium cursor-pointer md:text-base lg:text-lg ${activeTab === 'details' ? 'text-[#557df4] border-[#557df4]' : 'text-slate-500 border-transparent hover:border-slate-300'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </a>
        <a
          className={`border-b-[3px] w-6/12 py-4 -mb-[2px] text-sm font-medium cursor-pointer md:text-base lg:text-lg ${activeTab === 'schedules' ? 'text-[#557df4] border-[#557df4]' : 'text-slate-500 border-transparent hover:border-slate-300'}`}
          onClick={() => setActiveTab('schedules')}
        >
          Schedules
        </a>
      </div>

      <div className="tab-content mx-auto max-w-[40rem]">
        {activeTab === 'details' && (
          <div className="details-content">
            {spot.imagePath && (
            <div className="mb-6">
              <img
                className="w-full schedule-public-image"
                src={`${BASE_URL}/${spot.imagePath}`}
                alt={`${spot.name} image`}
              />
            </div>
            )}

            <div className="mb-12">
              <div className="flex items-center gap-4 mt-5">
                <MapPin className="w-5 h-5 text-gray-400" />
                <p>{spot.address}</p>
              </div>

              <div className="flex items-center gap-4 mt-5">
                <CloudSun className="w-6 h-6 text-gray-400" />
                <p>{spot.type == '1' ? 'Indoor' : spot.type == '2' ? 'Outdoor' : 'None'}</p>
              </div>

              <div className="flex items-center gap-4 mt-5">
                <Scaling className="w-6 h-5 text-gray-400" />
                <p>
                  {spot.sizeHeight ?
                    <>
                      {spot.sizeWidth}x{spot.sizeLength}x{spot.sizeHeight}m<sup>3</sup>
                    </>
                  :
                    <>
                      {spot.sizeWidth}x{spot.sizeLength}m<sup>2</sup>
                    </>
                  }
                </p>
              </div>
            </div>

            <div className="mb-12">
              <div className="border-b-2 pb-6 mb-6">
                <h2 className="text-title-sm font-semibold text-black">Owner</h2>
              </div>

              <div className="flex gap-6">
                <div>
                  <NavLink to={`/user/${spot.username}`}>
                    {spot.userImagePath ? (
                    <img
                      className="rounded-full review-user-image"
                      src={`${BASE_URL}/${spot.userImagePath}`}
                      alt={`${spot.username} image`}
                    />
                    ) : (
                    <img
                      className="rounded-full review-user-image"
                      src={`https://ui-avatars.com/api/?name=${spot.firstName} ${spot.lastName}&font-size=0.35&size=128&color=random&background=random&format=svg`} 
                      alt={`${spot.username} image`}
                    />
                    )}
                  </NavLink>
                </div>

                <div>
                  <NavLink to={`/user/${spot.username}`} className="hover:underline">
                    <p className="text-lg font-medium text-black">{spot.firstName} {spot.lastName}</p>
                  </NavLink>

                  {spot.phoneNumber && (
                  <div className="flex items-center gap-2.5 mt-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p>{spot.phoneNumber}</p>
                  </div>
                  )}
                </div>
              </div>
            </div>

            {spot.description && (
            <div className="mb-12">
              <div className="border-b-2 pb-6 mb-6">
                <h2 className="text-title-sm font-semibold text-black">Description</h2>
              </div>

              <p>{spot.description}</p>
            </div>
            )}

            <div className="mb-12">
              <div className="border-b-2 pb-6 mb-6">
                <h2 className="text-title-sm font-semibold text-black">Location</h2>
              </div>

              {spot.latitude && spot.longitude && (
              <div className="rounded-lg overflow-hidden mb-6">
                <iframe
                  src={`http://maps.google.com/maps?q=${spot.latitude},${spot.longitude}&z=16&output=embed`}
                  height="450"
                  width="100%"
                  style={{ border: "0", marginTop: "-150px" }}
                >
                </iframe>
              </div>
              )}

              <div>
                <NavLink
                  to={spot.location}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions to this Parking</span>
                </NavLink>
              </div>
            </div>
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
                    <NavLink to={`/schedule/${schedule.id}`}>
                      <h5 className="max-w-[24vw] truncate overflow-hidden font-medium text-black">{formatDateTime(schedule.startDateTime)} - {formatDateTime(schedule.endDateTime)}</h5>
                      
                      <div className="flex items-center gap-4 mt-1.5">
                        <p className="text-sm">Minimum hour: {schedule.minimumHour ? schedule.minimumHour : '1'}</p>

                        {schedule.charger && (
                          <div className="text-slate-400">|</div>
                        )}

                        {schedule.charger && (
                          <div className="flex items-center gap-2">
                            <BatteryCharging className="w-5 h-5 text-gray-400" />
                            <p className="text-sm">฿{formatPrice(schedule.chargerPrice)}/hr</p>
                          </div>
                        )}
                      </div>

                      <p className="mt-1.5"><span className="font-bold text-lg text-[#557df4]">฿{formatPrice(schedule.pricePerHour)}</span>/hr</p>
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

export default SpotShow;
