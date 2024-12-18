import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Bookmark, Share, MapPin, Scaling, CloudSun, BatteryCharging, Navigation, Star, Phone, Clock4 } from 'lucide-react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Schedule {
  id: string;
  user: User;
  userImagePath: string;
  spot: string;
  pricePerHour: string;
  minimumHour: string;
  charger: string;
  chargerPrice: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;

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
}

interface Review {
  reviewId: string;
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  rating: string;
  comment: string;
  createdAt: string;
}

interface Reservation {
  startDateTime: string;
  endDateTime: string;
}

const TableScheduleShow = ({ showId = "" }) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageStar, setAverageStar] = useState(0);
  const navigate = useNavigate();
  const [isAvailableOpen, setIsAvailableOpen] = useState(false);
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);

  const [formData, setFormData] = useState({
    scheduleDatetime: [] as string[],
  });

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

  const calculateTotalHours = () => {
    if (formData.scheduleDatetime.length === 2) {
        const startTime = new Date(formData.scheduleDatetime[0]).getTime();
        const endTime = new Date(formData.scheduleDatetime[1]).getTime();
        const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
        const totalHours = Math.max(diffInHours, parseInt(schedule?.minimumHour || '1'));
        console.log("Total Hours:", totalHours);
        return totalHours;
    }
    return 0;
  };

  const formatTotalHours = (totalHours: number) => {
    if (totalHours <= 0) {
        return '0 hour';
    }

    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const dayText = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
    const hourText = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';

    return [dayText, hourText].filter(Boolean).join(' ').trim();
  };

  const calculateTotalPrice = () => {
    const totalHours = calculateTotalHours();
    const pricePerHour = parseFloat(schedule?.pricePerHour || '0');
    if (isNaN(pricePerHour)) {
        console.error("Invalid pricePerHour value:", schedule?.pricePerHour);
        return 0;
    }
    return totalHours * pricePerHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(checkAuth) {
      if (!formData.scheduleDatetime || formData.scheduleDatetime.length !== 2) {
        toast.error('Duration should not be empty');
        return;
      }

      const [selectedStart, selectedEnd] = formData.scheduleDatetime;

      const availableTimes = calculateAvailableTime();
      const isWithinAvailableTime = availableTimes.some(({ start, end }) => {
        return (
          new Date(selectedStart) >= new Date(start) && 
          new Date(selectedEnd) <= new Date(end)
        );
      });

      if (!isWithinAvailableTime) {
        toast.error('Duration should be in Available Time');
        return;
      }

      try {
        navigate(`/schedule/${showId}/reserve`, { state: { scheduleDatetime: formData.scheduleDatetime } });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      window.location.href = `${BASE_URL}/login`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/schedules/display/${showId}`, {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reviews/schedule/${showId}`, {
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
        setReviews(data);

        let totalRating = 0;

        data.forEach((review: Review) => {
          const rating = parseInt(review.rating, 10);
          totalRating += rating;
        });

        const average = data.length > 0 ? (totalRating / data.length).toFixed(2) : 0;
        setAverageStar(Number(average));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/reservations/schedule/${showId}`, {
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
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatReviewDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy");
  };

  const formatNumber = (price: string) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(Number(price));
  };

  const calculateAvailableTime = () => {
    if (!schedule) return [];
  
    const totalStart = new Date(schedule.startDateTime);
    const totalEnd = new Date(schedule.endDateTime);
  
    const sortedReservations = reservations
      .map(reservation => ({
        start: new Date(reservation.startDateTime),
        end: new Date(reservation.endDateTime),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  
    const availableTimeRanges = [];
    let lastEnd = totalStart;
  
    for (const reservation of sortedReservations) {
      if (lastEnd < reservation.start) {
        const availableStart = lastEnd;
        const availableEnd = reservation.start;
  
        const durationInHours = (availableEnd.getTime() - availableStart.getTime()) / (1000 * 60 * 60);
        if (durationInHours >= (schedule.minimumHour !== null ? parseInt(schedule.minimumHour) : 1)) {
          availableTimeRanges.push({
            start: availableStart,
            end: availableEnd,
          });
        }
      }

      if (lastEnd < reservation.end) {
        lastEnd = reservation.end;
      }
    }
  
    if (lastEnd < totalEnd) {
      const finalStart = lastEnd;
      const finalEnd = totalEnd;
  
      const durationInHours = (finalEnd.getTime() - finalStart.getTime()) / (1000 * 60 * 60);
      if (durationInHours >= (schedule.minimumHour !== null ? parseInt(schedule.minimumHour) : 1)) {
        availableTimeRanges.push({
          start: finalStart,
          end: finalEnd,
        });
      }
    }
  
    return availableTimeRanges;
  };
  

  useEffect(() => {
    const fetchData = async () => {

      if(checkAuth) {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await fetch(`${BASE_URL}/member/bookmarks/show/${showId}`, {
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
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred loading data.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);


  const handleBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if(checkAuth) {
      try {
        const response = await fetch(`${BASE_URL}/member/bookmarks/update/${showId}`, {
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
    <>
    <div>
      <h2 className="text-title-md2 font-semibold text-black mb-8">{schedule.spotName}</h2>

      <div className="mb-7 flex flex-col gap-12 lg:flex-row">
        <div className="w-full lg:w-3/5">

          {schedule.spotImagePath && (
          <div className="mb-10">
            <img
              className="w-full schedule-public-image"
              src={`${BASE_URL}/${schedule.spotImagePath}`}
              alt={`${schedule.spotName} image`}
            />
          </div>
          )}

          <div className="mb-12">
            <div className="border-b-2 pb-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-title-sm font-semibold text-black">Parking Details</h2>
                
                <div className="flex items-center gap-5">
                  <button onClick={handleBookmark}>
                    {isBookmark ? (
                      <Bookmark className="w-7 h-7 text-gray-400 hover:text-gray-600 hover:fill-current" fill="#9ca3af"/>
                    ) : (
                      <Bookmark className="w-7 h-7 text-gray-400 hover:text-gray-600"/>
                    )}
                  </button>

                  <button onClick={handleShare}>
                    <Share className="w-7 h-7 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <MapPin className="w-5 h-5 text-gray-400" />
              <p>{schedule.spotAddress}</p>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <CloudSun className="w-6 h-6 text-gray-400" />
              <p>{schedule.spotType == '1' ? 'Indoor' : schedule.spotType == '2' ? 'Outdoor' : 'None'}</p>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <Scaling className="w-6 h-5 text-gray-400" />
              <p>
                {schedule.spotSizeHeight ?
                  <>
                    {schedule.spotSizeWidth}x{schedule.spotSizeLength}x{schedule.spotSizeHeight}m<sup>3</sup>
                  </>
                :
                  <>
                    {schedule.spotSizeWidth}x{schedule.spotSizeLength}m<sup>2</sup>
                  </>
                }
              </p>
            </div>

            {schedule.charger && (
            <div className="flex items-center gap-4 mt-5">
              <BatteryCharging className="w-6 h-6 text-gray-400" />
              <p>฿{formatPrice(schedule.chargerPrice)}/hr</p>
            </div>
            )}

            <NavLink
              to={`/spot/${schedule.spot}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              <p className="mt-5">More Details and Schedules</p>
            </NavLink>
          </div>

          {schedule.description && (
          <div className="mb-12">
            <div className="border-b-2 pb-6 mb-6">
              <h2 className="text-title-sm font-semibold text-black">Description</h2>
            </div>

            <p>{schedule.description}</p>
          </div>
          )}

          <div className="mb-12">
            <div className="border-b-2 pb-6 mb-6">
              <h2 className="text-title-sm font-semibold text-black">Location</h2>
            </div>

            {schedule.spotLatitude && schedule.spotLongitude && (
            <div className="rounded-lg overflow-hidden mb-6">
              <iframe
                src={`http://maps.google.com/maps?q=${schedule.spotLatitude},${schedule.spotLongitude}&z=16&output=embed`}
                height="450"
                width="100%"
                style={{ border: "0", marginTop: "-150px" }}
              >
              </iframe>
            </div>
            )}

            <div>
              <NavLink
                to={schedule.spotLocation}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-4 h-4" />
                <span>Directions to this Parking</span>
              </NavLink>
            </div>
          </div>

          <div className="mb-8">
            <div className="border-b-2 pb-6 mb-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-title-sm font-semibold text-black">Reviews</h2>
                  
                  <p className="text-warning font-medium flex text-lg items-center gap-2">
                    <Star fill="#ffa70b" className="w-5 h-5" />
                    <span>{formatNumber(averageStar.toString())}</span>
                  </p>
                </div>

                <p className="text-sm">{formatNumber(reviews.length.toString())} reviews</p>
              </div>
            </div>

            {reviews.length == 0 ? (
              <div className="max-w-full py-40 px-4 text-center">
                <p>No review found</p>
              </div>
            ) : (
              <div>
                {reviews.map((review, key) => (
                  <div key={key}>
                    <div className="flex justify-between gap-6 mb-8">
                      <div className="flex gap-6">
                        <div className="min-w-[60px]">
                          <NavLink to={`/user/${review.username}`}>
                            {review.imagePath ? (
                            <img
                              className="rounded-full review-user-image"
                              src={`${BASE_URL}/${review.imagePath}`}
                              alt={`${review.username} image`}
                            />
                            ) : (
                            <img
                              className="rounded-full review-user-image"
                              src={`https://ui-avatars.com/api/?name=${review.firstName} ${review.lastName}&font-size=0.35&size=128&color=random&background=random&format=svg`} 
                              alt={`${review.username} image`}
                            />
                            )}
                          </NavLink>
                        </div>

                        <div>
                          <NavLink to={`/user/${review.username}`} className="hover:underline">
                            <p className="text-lg font-medium text-black">{review.firstName} {review.lastName}</p>
                          </NavLink>

                          <p className="text-warning font-medium flex items-center gap-1.5 mt-1">
                            {Number(review.rating) >= 1 && (
                              <Star fill="#ffa70b" className="w-4 h-4" />
                            )}

                            {Number(review.rating) >= 2 && (
                              <Star fill="#ffa70b" className="w-4 h-4" />
                            )}

                            {Number(review.rating) >= 3 && (
                              <Star fill="#ffa70b" className="w-4 h-4" />
                            )}

                            {Number(review.rating) >= 4 && (
                              <Star fill="#ffa70b" className="w-4 h-4" />
                            )}

                            {Number(review.rating) == 5 && (
                              <Star fill="#ffa70b" className="w-4 h-4" />
                            )}
                          </p>

                          {review.comment && (
                            <p className="mt-1.5">{review.comment}</p>
                          )}
                        </div>
                      </div>
                      
                      <p className="min-w-[100px] text-sm text-right">{formatReviewDateTime(review.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="sticky top-30">
            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="text-lg font-medium text-black mb-3">Duration</p>

                  <DateRangePicker
                    value={formData.scheduleDatetime.length === 2 ? [
                      new Date(formData.scheduleDatetime[0]),
                      new Date(formData.scheduleDatetime[1])
                    ] : null}
                    onChange={(dates) => {
                      if (dates && dates.length === 2) {
                        const adjustMinutes = (date: Date) => {
                          const minutes = date.getMinutes();
                          const adjustedMinutes = Math.round(minutes / 5) * 5;
                          date.setMinutes(adjustedMinutes);
                          return date;
                        };
                  
                        const startDate = adjustMinutes(new Date(dates[0]));
                        let endDate = adjustMinutes(new Date(dates[1]));

                        const diffMs = endDate.getTime() - startDate.getTime();
                        const diffHours = Math.max((schedule.minimumHour !== null ? parseInt(schedule.minimumHour) : 1), Math.ceil(diffMs / (60 * 60 * 1000)));
                        endDate = new Date(startDate.getTime() + diffHours * 60 * 60 * 1000);
                  
                        setFormData({
                          ...formData,
                          scheduleDatetime: [
                            startDate.toISOString(),
                            endDate.toISOString()
                          ],
                        });
                      }
                    }}
                    style={{ width: '100%' }}
                    cleanable={false}
                    format="dd/MM/yyyy HH:mm"
                    character=' - '
                    placeholder='Select Duration'
                    ranges={[]}
                  />

                  <p className="text-sm mt-4">Period: {formatDateTime(schedule.startDateTime)} - {formatDateTime(schedule.endDateTime)}</p>
                  <p className="text-sm mt-2">Minimum hour: {schedule.minimumHour ? schedule.minimumHour : '1'}</p>
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    className={`flex items-center justify-between rounded-lg border w-full px-5 py-3 ${isAvailableOpen ? 'rounded-b-none' : ''} text-[#17c653] bg-[#effff4]`}
                    onClick={() => setIsAvailableOpen(!isAvailableOpen)}
                  >
                    <span className="text-[15px]">Available Time</span>
                    <svg
                      className={`w-3 h-3 transition-transform ${isAvailableOpen ? '' : 'rotate-180'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                  {isAvailableOpen && (
                    <div className="px-5 py-4 border border-t-0 rounded-b-lg text-[#17c653] bg-[#effff4]">
                      {calculateAvailableTime().length == 0 ? (
                        <p className="text-sm text-center">No available time</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {calculateAvailableTime().map((timeRange, key) => (
                            <div className="flex items-center gap-2" key={key}>
                              <Clock4 className="w-4 h-4"/>
                              <p className="text-sm">{formatDateTime(timeRange.start.toISOString())} - {formatDateTime(timeRange.end.toISOString())}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <button
                    type="button"
                    className={`flex items-center justify-between rounded-lg border w-full px-5 py-3 ${isUnavailableOpen ? 'rounded-b-none' : ''} text-[#f8285a] bg-[#fff3f6]`}
                    onClick={() => setIsUnavailableOpen(!isUnavailableOpen)}
                  >
                    <span className="text-[15px]">Unavailable Time</span>
                    <svg
                      className={`w-3 h-3 transition-transform ${isUnavailableOpen ? '' : 'rotate-180'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                  {isUnavailableOpen && (
                    <div className="px-5 py-4 border border-t-0 rounded-b-lg text-[#f8285a] bg-[#fff3f6]">
                      {reservations.length == 0 ? (
                        <p className="text-sm text-center">No unavailable time</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {reservations
                          .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
                          .map((reservation, key) => (
                            <div className="flex items-center gap-2" key={key}>
                              <Clock4 className="w-4 h-4"/>
                              <p className="text-sm">{formatDateTime(reservation.startDateTime)} - {formatDateTime(reservation.endDateTime)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Total Duration</p>
                  <p className="font-medium text-[#557df4]">{formatTotalHours(calculateTotalHours())}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Price Per Hour</p>
                  <p className="font-medium text-[#557df4]">฿{formatPrice(schedule.pricePerHour)}</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="font-medium text-gray-900">Total Price</p>
                  <p className="font-medium text-[#557df4]">฿{formatPrice(calculateTotalPrice())}</p>
                </div>
                
                <button className="block w-full rounded-full py-2 text-center font-medium text-white bg-[#557df4] hover:bg-[#4166e0]">
                  Reserve
                </button>
              </form>
            </div>

            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6">
              <p className="text-lg font-medium text-black mb-4">Owner</p>

              <div className="flex gap-6">
                <div>
                  <NavLink to={`/user/${schedule.user.username}`}>
                    {schedule.userImagePath ? (
                    <img
                      className="rounded-full review-user-image"
                      src={`${BASE_URL}/${schedule.userImagePath}`}
                      alt={`${schedule.user.username} image`}
                    />
                    ) : (
                    <img
                      className="rounded-full review-user-image"
                      src={`https://ui-avatars.com/api/?name=${schedule.user.firstName} ${schedule.user.lastName}&font-size=0.35&size=128&color=random&background=random&format=svg`} 
                      alt={`${schedule.user.username} image`}
                    />
                    )}
                  </NavLink>
                </div>

                <div>
                  <NavLink to={`/user/${schedule.user.username}`} className="hover:underline">
                    <p className="text-lg font-medium text-black">{schedule.user.firstName} {schedule.user.lastName}</p>
                  </NavLink>

                  {schedule.user.phoneNumber && (
                  <div className="flex items-center gap-2.5 mt-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p>{schedule.user.phoneNumber}</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TableScheduleShow;