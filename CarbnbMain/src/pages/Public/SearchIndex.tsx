import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MapPin, Scaling, CloudSun, BatteryCharging, Clock4, Star, ThumbsUp, CalendarPlus } from 'lucide-react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

interface Schedule {
  id: string;
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
  spotDescription: string;
  spotSizeWidth: string;
  spotSizeLength: string;
  spotSizeHeight: string;
  spotImagePath: string;
  spotLatitude: string;
  spotLongitude: string;

  reviews: string;
}

const SearchIndex = () => {
  const [query, setQuery] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedTypeOption, setSelectedTypeOption] = useState<string>('');
  const [isTypeOptionSelected, setIsTypeOptionSelected] = useState<boolean>(false);
  const [selectedPriceOption, setSelectedPriceOption] = useState<string>('');
  const [isPriceOptionSelected, setIsPriceOptionSelected] = useState<boolean>(false);
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<string>('');
  const [isVehicleOptionSelected, setIsVehicleOptionSelected] = useState<boolean>(false);
  const [selectedChargerOption, setSelectedChargerOption] = useState<string>('');
  const [isChargerOptionSelected, setIsChargerOptionSelected] = useState<boolean>(false);
  const [selectedSortOption, setSelectedSortOption] = useState<string>('');
  const [isSortOptionSelected, setIsSortOptionSelected] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    type: '',
    price: '',
    vehicle: '',
    charger: '',
    scheduleDatetime: [] as string[],
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const qValue = searchParams.get('q');
    setQuery(qValue || '');

    const scheduleDatetime = searchParams.get('scheduleDatetime');
    const vehicle = searchParams.get('vehicle');

    if (scheduleDatetime) {
      const datetimeArray = scheduleDatetime.split(',');
      setFormData(prev => ({
        ...prev,
        scheduleDatetime: datetimeArray,
      }));
    }

    if (vehicle) {
      setSelectedVehicleOption(vehicle);
      setFormData(prev => ({
        ...prev,
        vehicle,
      }));
    }
  }, [location.search]);

  const handleTypeOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedTypeOption(value);
    setFormData(prev => ({ ...prev, type: value }));
    changeTextColor('type');
  };

  const handlePriceOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedPriceOption(value);
    setFormData(prev => ({ ...prev, price: value }));
    changeTextColor('price');
  };

  const handleVehicleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedVehicleOption(value);
    setFormData(prev => ({ ...prev, vehicle: value }));
    changeTextColor('vehicle');
  };

  const handleChargerOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedChargerOption(value);
    setFormData(prev => ({ ...prev, charger: value }));
    changeTextColor('charger');
  };

  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedSortOption(value);
    setFormData(prev => ({ ...prev, type: value }));
    changeTextColor('sort');
  };

  const changeTextColor = (type: 'type' | 'price' | 'vehicle' | 'charger' | 'sort') => {
    if (type === 'type') {
      setIsTypeOptionSelected(true);
    } else if (type === 'price') {
      setIsPriceOptionSelected(true);
    } else if (type === 'vehicle') {
      setIsVehicleOptionSelected(true);
    } else {
      setIsChargerOptionSelected(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/schedules/search`, {
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
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatNumber = (price: string | number) => {
    const number = Number(price);
    if (number % 1 === 0) {
      return number.toFixed(0);
    }
    return number.toFixed(1);
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(Number(price));
  };

  const filteredSchedules = schedules
    .filter((schedule) => {
      const queryLower = query.toLowerCase();
      const matchesQuery =
        (schedule.spotName && schedule.spotName.toLowerCase().includes(queryLower)) ||
        (schedule.spotAddress && schedule.spotAddress.toLowerCase().includes(queryLower)) ||
        (schedule.spotDescription && schedule.spotDescription.toLowerCase().includes(queryLower)) ||
        (schedule.description && schedule.description.toLowerCase().includes(queryLower));
    
      const matchesDuration = () => {
        if (formData.scheduleDatetime.length === 2) {
          const [selectedStart, selectedEnd] = formData.scheduleDatetime.map(date => new Date(date));
    
          const scheduleStart = new Date(schedule.startDateTime);
          const scheduleEnd = new Date(schedule.endDateTime);
    
          return (scheduleStart <= selectedStart && scheduleEnd >= selectedEnd);
        }
        return true;
      };
      
      const matchesType = selectedTypeOption
        ? (selectedTypeOption == '1' && schedule.spotType == '1') || (selectedTypeOption == '2' && schedule.spotType == '2')
        : true;
    
      const price = parseFloat(schedule.pricePerHour);
      const matchesPrice = selectedPriceOption
        ? selectedPriceOption == '1' && price < 50 ||
          selectedPriceOption == '2' && price >= 50 && price <= 100 ||
          selectedPriceOption == '3' && price >= 101 && price <= 150 ||
          selectedPriceOption == '4' && price >= 151 && price <= 200 ||
          selectedPriceOption == '5' && price > 200
        : true;
    
      const width = parseFloat(schedule.spotSizeWidth);
      const length = parseFloat(schedule.spotSizeLength);
      const matchesVehicle = selectedVehicleOption
        ? (selectedVehicleOption == '1' && width >= 2.4 && length >= 5) ||
          (selectedVehicleOption == '2' && width >= 1 && width < 2.4 && length >= 2 && length < 5)
        : true;
    
      const matchesCharger = selectedChargerOption
        ? (selectedChargerOption == '1' && schedule.charger) || (selectedChargerOption == '2' && !schedule.charger)
        : true;
    
      return matchesQuery && matchesDuration() && matchesType && matchesPrice && matchesVehicle && matchesCharger;
    })
    .sort((a, b) => {
      const sizeA = parseFloat(a.spotSizeWidth) * parseFloat(a.spotSizeLength);
      const sizeB = parseFloat(b.spotSizeWidth) * parseFloat(b.spotSizeLength);
      const priceA = parseFloat(a.pricePerHour);
      const priceB = parseFloat(b.pricePerHour);
      const chargePriceA = parseFloat(a.chargerPrice || '0');
      const chargePriceB = parseFloat(b.chargerPrice || '0');
      const reviewsA = parseFloat(a.reviews || '0');
      const reviewsB = parseFloat(b.reviews || '0');
  
      switch (selectedSortOption) {
        case null:
          return reviewsB - reviewsA;
        case '1':
          return reviewsA - reviewsB;
        case '2':
          return priceA - priceB;
        case '3':
          return priceB - priceA;
        case '4':
          if (chargePriceA == 0 && chargePriceB == 0) return 0;
          if (chargePriceA == 0) return 1;
          if (chargePriceB == 0) return -1;
          return chargePriceA - chargePriceB;
        case '5':
          if (chargePriceA == 0 && chargePriceB == 0) return 0;
          if (chargePriceA == 0) return 1;
          if (chargePriceB == 0) return -1;
          return chargePriceB - chargePriceA;
        case '6':
          return sizeA - sizeB;
        case '7':
          return sizeB - sizeA;
        default:
          return reviewsB - reviewsA;
      }
    });

  const handleReset = () => {
    setFormData({
      type: '',
      price: '',
      vehicle: '',
      charger: '',
      scheduleDatetime: []
    });

    setSelectedTypeOption('');
    setSelectedPriceOption('');
    setSelectedVehicleOption('');
    setSelectedChargerOption('');
    setSelectedSortOption('');
    
    setIsTypeOptionSelected(false);
    setIsPriceOptionSelected(false);
    setIsVehicleOptionSelected(false);
    setIsChargerOptionSelected(false);
    setIsSortOptionSelected(false);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('vehicle');
    searchParams.delete('scheduleDatetime');
    window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <>
      <h2 className="text-title-md2 font-semibold text-black mb-8">
        <span className="text-gray-500">Search results for </span>{query}
      </h2>

      <div className="mb-8 flex flex-col-reverse gap-12 lg:flex-row">
        <div className="w-full lg:w-[70%]">
          {filteredSchedules.length === 0 || !query ? (
            <div className="max-w-full py-12 px-4 text-center">
              <p>No schedule found</p>
            </div>
          ) : (
            <>
              {filteredSchedules.map((schedule, key) => (
                <div key={key} className="relative w-full rounded-lg border border-stroke bg-white shadow-default hover:bg-gray-100 px-8 py-6 mb-6">
                  <NavLink to={`/schedule/${schedule.id}`} className="flex flex-col sm:flex-row gap-6">
                    <div className="relative">
                      {schedule.spotImagePath ? (
                      <img
                        className="schedule-search-image w-full sm:w-[150px]"
                        src={`${BASE_URL}/${schedule.spotImagePath}`}
                        alt={`${schedule.spotName} image`}
                      />
                      ) : (
                      <img
                        className="schedule-search-image w-full sm:w-[150px]"
                        src={`${DEFAULT_IMAGE}`} 
                        alt="Default image"
                      />
                      )}

                      <div className="absolute bottom-2 right-2 bg-white shadow-default font-medium rounded-full px-3 py-1">
                        <p className="text-warning flex text-xs items-center gap-1">
                          <Star fill="#ffa70b" className="w-3 h-3"/>
                          <span>{formatNumber(schedule.reviews)}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="max-w-[25vw] truncate overflow-hidden font-medium text-black text-lg">{schedule.spotName}</h5>

                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-sm">{schedule.spotAddress}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Clock4 className="w-4 h-4 text-gray-400" />
                        <p className="text-sm">{formatDateTime(schedule.startDateTime)} - {formatDateTime(schedule.endDateTime)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mt-2">
                          <CloudSun className="w-5 h-5 text-gray-400 mb-1" />
                          <p className="text-sm">{schedule.spotType == '1' ? 'Indoor' : schedule.spotType == '2' ? 'Outdoor' : 'None'}</p>
                        </div>

                        <div className="text-slate-400 mt-1.5">|</div>

                        <div className="flex items-center gap-2 mt-2">
                          <Scaling className="w-4 h-4 text-gray-400" />
                          <p className="text-sm">
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
                          <div className="text-slate-400 mt-1.5">|</div>
                        )}

                        {schedule.charger && (
                          <div className="flex items-center gap-2 mt-2">
                            <BatteryCharging className="w-5 h-5 text-gray-400" />
                            <p className="text-sm">฿{formatPrice(schedule.chargerPrice)}/hr</p>
                          </div>
                        )}
                      </div>
                      
                      <p className="mt-2 text-sm"><span className="font-bold text-base text-[#557df4]">฿{formatPrice(schedule.pricePerHour)}</span>/hr</p>
                    </div>
                  </NavLink>
                  
                  {key < 3 && (
                  <div className="absolute top-[12rem] sm:top-6 right-0 bg-black bg-opacity-50 shadow-default font-medium rounded-full rounded-r-none px-3 py-1.5">
                    <p className="text-white flex text-xs items-center gap-2">
                      <ThumbsUp fill="#fff" className="w-3 h-3"/>
                      <span>Recommend</span>
                    </p>
                  </div>
                  )}

                  <NavLink
                    to={`/schedule/${schedule.id}`}
                    className="absolute invisible xl:visible bottom-6 right-6 flex items-center gap-2.5 rounded-lg py-2 px-4 text-sm text-center font-medium text-white border-2 border-[#557df4] bg-[#557df4] hover:bg-[#4166e0]"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Reserve
                  </NavLink>

                </div>
              ))}
            </>
          )}
        </div>

        <div className="w-full lg:w-[30%]">
          <div className="sticky top-30">
            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8 max-h-[80vh] overflow-y-auto">

                <div className="mb-6">
                  <p className="font-medium text-black mb-2.5">Sort by</p>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="sort"
                      value={selectedSortOption}
                      onChange={handleSortOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isSortOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        Rating (high to low)
                      </option>
                      <option value="1" className="text-body">
                        Rating (low to high)
                      </option>
                      <option value="2" className="text-body">
                        Price (low to high)
                      </option>
                      <option value="3" className="text-body">
                        Price (high to low)
                      </option>
                      <option value="4" className="text-body">
                        Charge price (low to high)
                      </option>
                      <option value="5" className="text-body">
                        Charge price (high to low)
                      </option>
                      <option value="6" className="text-body">
                        Size (small to large)
                      </option>
                      <option value="7" className="text-body">
                        Size (large to small)
                      </option>
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-black mb-2.5">Duration</p>

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
                        const diffHours = Math.max(1, Math.ceil(diffMs / (60 * 60 * 1000)));
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
                    placement="bottomEnd"
                  />
                </div>

                <div className="mb-6">
                  <p className="font-medium text-black mb-2.5">Type</p>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="type"
                      value={selectedTypeOption}
                      onChange={handleTypeOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isTypeOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        All
                      </option>
                      <option value="1" className="text-body">
                        Indoor
                      </option>
                      <option value="2" className="text-body">
                        Outdoor
                      </option>
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-black mb-2.5">Price</p>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="price"
                      value={selectedPriceOption}
                      onChange={handlePriceOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isPriceOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        All
                      </option>
                      <option value="1" className="text-body">
                        Less than ฿50
                      </option>
                      <option value="2" className="text-body">
                        ฿50 to ฿100
                      </option>
                      <option value="3" className="text-body">
                        ฿101 to ฿150
                      </option>
                      <option value="4" className="text-body">
                        ฿151 to ฿200
                      </option>
                      <option value="5" className="text-body">
                        More than ฿200
                      </option>
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-black mb-2.5">Vehicle</p>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="vehicle"
                      value={selectedVehicleOption}
                      onChange={handleVehicleOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isVehicleOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        All
                      </option>
                      <option value="1" className="text-body">
                        Car
                      </option>
                      <option value="2" className="text-body">
                        Motorcycle
                      </option>
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="font-medium text-black mb-2.5">EV Charger</p>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="charger"
                      value={selectedChargerOption}
                      onChange={handleChargerOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isChargerOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        All
                      </option>
                      <option value="1" className="text-body">
                        Yes
                      </option>
                      <option value="2" className="text-body">
                        No
                      </option>
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="block w-full rounded-full py-2.5 text-center font-medium text-slate-500 border-2 border-stroke bg-gray-100 hover:bg-gray-200"
                >
                  Reset
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchIndex;
