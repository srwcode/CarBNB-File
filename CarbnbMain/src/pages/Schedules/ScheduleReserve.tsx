import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE } from '../../config.js';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { MapPin, Scaling, CloudSun, BatteryCharging, Clock4, Circle, SquareParking, CircleCheckBig, Check } from 'lucide-react';
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
  spotSizeWidth: string;
  spotSizeLength: string;
  spotSizeHeight: string;
  spotImagePath: string;
  spotLatitude: string;
  spotLongitude: string;
}

interface Reservation {
  startDateTime: string;
  endDateTime: string;
}

interface Vehicle {
  vehicleId: string;
  type: string;
  licensePlate: string;
  province: string;
  brand: string;
  model: string;
  color: string;
  imagePath: string;
}

const PaymentMethods = [
  {
    id: "bank",
    name: "Mobile Banking"
  },
  {
    id: "promptpay",
    name: "QR Promptpay"
  },
  {
    id: "card",
    name: "Credit/Debit card"
  },
  {
    id: "paypal",
    name: "PayPal"
  },
  {
    id: "google",
    name: "Google Pay"
  },
  {
    id: "apple",
    name: "Apple Pay"
  },
  {
    id: "payoneer",
    name: "Payoneer"
  },
  {
    id: "usdt",
    name: "USDT"
  },
];


const ScheduleReserve = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<string>('');
  const [selectedVehicleLicensePlateOption, setSelectedVehicleLicensePlateOption] = useState<string>('');
  const [selectedPaymentMethodOption, setSelectedPaymentMethodOption] = useState<string>('');
  const [reservationId, setReservationId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  const location = useLocation();

  const [formData, setFormData] = useState({
    schedule: '',
    vehicle: '',
    scheduleDatetime: location.state?.scheduleDatetime || [],
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/schedules/display/${id}`, {
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
        
        const response = await fetch(`${BASE_URL}/member/reservations/schedule/${id}`, {
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
      try {
        const response = await fetch(`${BASE_URL}/member/vehicles/index`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const handleVehicleOptionChange = (vehicleId: string, vehicleLicensePlate: string) => {
    setSelectedVehicleOption(vehicleId);
    setSelectedVehicleLicensePlateOption(vehicleLicensePlate);
  };

  const handlePaymentMethodOptionChange = (methodId: string) => {
    setSelectedPaymentMethodOption(methodId);
  };

  const StepperComponent = () => {
    const steps = [
      { 
        number: 1, 
        icon: 1, 
        title: "Select Vehicle"
      },
      { 
        number: 2, 
        icon: 2, 
        title: "Make Payment"
      },
      { 
        number: 3, 
        icon: 3, 
        title: "Complete"
      }
    ];

    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 mb-10">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="flex-1 flex flex-col items-center relative"
            >
              <div 
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                  rounded-full flex items-center justify-center 
                  ${currentStep === step.number 
                    ? 'bg-[#557df4] text-white' 
                    : currentStep > step.number
                    ? 'bg-[#17c653] text-white' 
                    : 'bg-gray-200 text-gray-500'
                  } 
                  transition-all duration-300 mb-2 lg:mb-2.5 relative z-10
                `}
              >
                {currentStep > step.number && currentStep !== step.number 
                  ? <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> 
                  : step.icon}
              </div>

              <span 
                className={`
                  text-xs sm:text-sm md:text-base 
                  font-medium text-center 
                  ${currentStep === step.number 
                    ? 'text-[#557df4]' 
                    : currentStep > step.number
                    ? 'text-[#17c653]' 
                    : 'text-gray-500'
                  }
                `}
              >
                {step.title}
              </span>

              {index < steps.length - 1 && (
                <div 
                  className={`
                    absolute top-4 sm:top-5 md:top-6 
                    left-1/2 right-0
                    h-0.5 lg:h-[3px] w-full 
                    ${currentStep > step.number 
                      ? 'bg-[#17c653]' 
                      : 'bg-gray-200'
                    } 
                    -translate-y-1/2 z-0
                  `} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedVehicleOption) {

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

      if (!selectedVehicleOption) {
        toast.error('Vehicle should not be empty');
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2 && selectedPaymentMethodOption) {

      if (!selectedPaymentMethodOption) {
        toast.error('Payment method should not be empty');
        return;
      }

      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        vehicle: parseInt(selectedVehicleOption),
        reservationDatetime: formData.scheduleDatetime.length === 2
        ? `${new Date(formData.scheduleDatetime[0]).toLocaleDateString('en-GB')} ${new Date(formData.scheduleDatetime[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${new Date(formData.scheduleDatetime[1]).toLocaleDateString('en-GB')} ${new Date(formData.scheduleDatetime[1]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
        : ''
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('reservation', jsonBlob);

      const response = await fetch(`${BASE_URL}/member/reservations/store/${id}`, {
        method: "POST",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const created = await response.json();

        if(created != null) {
          setReservationId(created);

          const formDataPaymentToSend = new FormData();
      
          const jsonData = {
            amount: calculateTotalPrice(),
            method: selectedPaymentMethodOption
          };

          const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
          formDataPaymentToSend.append('payment', jsonBlob);

          const responsePayment = await fetch(`${BASE_URL}/member/payments/store/${created}`, {
            method: "POST",
            credentials: 'include',
            body: formDataPaymentToSend,
          });

          if (responsePayment.ok) {
            setCurrentStep(3);
          } else {
            toast.error('Failed to create payment');
          }

        } else {
          toast.error('Failed to create');
        }
      } else {
        console.error("Failed to create:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
    <StepperComponent />

      {currentStep === 1 && (
      <div>
        <div className="mb-7 flex flex-col gap-12 lg:flex-row">
          <div className="w-full lg:w-3/5">

            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-8">
                <div>
                  {schedule.spotImagePath && (
                    <img
                      className="w-full sm:w-[200px] schedule-reservation-image"
                      src={`${BASE_URL}/${schedule.spotImagePath}`} 
                      alt={`${schedule.spotName} image`} 
                    />
                  )}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg truncate">{schedule.spotName}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <p>{schedule.spotAddress}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <CloudSun className="w-6 h-6 text-gray-400" />
                    <p>{schedule.spotType == '1' ? 'Indoor' : schedule.spotType == '2' ? 'Outdoor' : 'None'}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
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
                    <div className="flex items-center gap-4 mt-4">
                      <BatteryCharging className="w-6 h-6 text-gray-400" />
                      <p>฿{formatPrice(schedule.chargerPrice)}/hour</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Duration</h2>

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

              <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-2/4">
                  <div className="rounded-lg border w-full px-5 py-3 rounded-b-none text-[#17c653] bg-[#effff4]">
                    <span className="text-[15px]">Available Time</span>
                  </div>
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
                </div>

                <div className="w-full lg:w-2/4">
                  <div className="rounded-lg border w-full px-5 py-3 rounded-b-none text-[#f8285a] bg-[#fff3f6]">
                    <span className="text-[15px]">Unavailable Time</span>
                  </div>
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
                </div>
              </div>
            </div>

            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Select Vehicle</h2>
              
              <div className="w-full mb-2">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
                  {vehicles.map((vehicle) => {
                    const vehicleIdString = String(vehicle.vehicleId);
                    const vehicleLicensePlate = String(vehicle.licensePlate);
                    const isSelected = vehicleIdString === selectedVehicleOption;
                    
                    return (
                      <div 
                        key={vehicleIdString}
                        onClick={() => handleVehicleOptionChange(vehicleIdString, vehicleLicensePlate)}
                        className={`cursor-pointer ${
                          isSelected 
                            ? 'border-4 border-gray-500' 
                            : 'border-2 border-stroke'
                        } bg-white shadow-default hover:bg-gray-100 rounded px-8 py-6 text-center`}
                      >
                        <p className="text-title-sm font-bold text-black">
                          {vehicle.brand} {vehicle.model}
                        </p>

                        <div className="flex justify-center mt-4 mb-5">
                          {vehicle.imagePath ? (
                            <img
                              className="list-vehicle-image"
                              src={`${BASE_URL}/${vehicle.imagePath}`}
                              alt={`${vehicle.licensePlate} image`}
                            />
                          ) : (
                            <img
                              className="list-vehicle-image"
                              src={DEFAULT_IMAGE}
                              alt="Default image"
                            />
                          )}
                        </div>

                        <p className="text-slate-500 text-lg">{vehicle.licensePlate}</p>
                        <p className="text-slate-500 mt-2">({vehicle.province})</p>
                        
                        <input
                          type="radio"
                          name="vehicle"
                          value={vehicleIdString}
                          checked={isSelected}
                          onChange={() => {}}
                          className="hidden"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5">
            <div className="sticky top-30">
              <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservation Details</h2>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Check in</p>
                  <p className="font-medium text-[#557df4]">{formatDateTime(formData.scheduleDatetime[0])}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Check out</p>
                  <p className="font-medium text-[#557df4]">{formatDateTime(formData.scheduleDatetime[1])}</p>
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
                
                <button
                  onClick={handleNextStep}
                  disabled={!selectedVehicleOption}
                  className={`block w-full rounded-full py-2 text-center font-medium text-white border-2 border-[#557df4] bg-[#557df4] hover:bg-[#4166e0] ${!selectedVehicleOption ? 'opacity-50' : '' }`}
                >
                  Next
                </button>

                <NavLink
                  to={`/schedule/${id}`}
                  className="block text-center text-slate-500 hover:underline mt-4"
                >
                  <p>Cancel</p>
                </NavLink>
              </div>

            </div>
          </div>
        </div>
      </div>
      )}

      {currentStep === 2 && (
      <div>
        <div className="mb-7 flex flex-col gap-12 lg:flex-row">
          <div className="w-full lg:w-3/5">
            <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 py-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Select Payment Method</h2>
              
              <div className="w-full mb-2">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
                  {PaymentMethods.map((method) => {
                    const methodId = String(method.id);
                    const isMethodSelected = methodId === selectedPaymentMethodOption;
                    
                    return (
                      <div 
                        key={methodId}
                        onClick={() => handlePaymentMethodOptionChange(methodId)}
                        className={`cursor-pointer ${
                          isMethodSelected 
                            ? 'border-2 border-[#557df4]' 
                            : 'border-2 border-stroke'
                        } bg-white shadow-default hover:bg-gray-100 rounded-xl px-6 py-6 text-center`}
                      >
                        <div className="flex items-center gap-4">
                          {isMethodSelected ? (
                            <Circle className="w-4 h-4 text-[#557df4]" fill="#557df4" strokeWidth={2}/>
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" strokeWidth={2}/>
                          )}
                          <p className="text-title-xsm font-bold text-black">{method.name}</p>
                        </div>
                        
                        <input
                          type="radio"
                          name="method"
                          value={methodId}
                          checked={isMethodSelected}
                          onChange={() => {}}
                          className="hidden"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5">
            <div className="sticky top-30">
              <div className="w-full rounded-lg border border-stroke bg-white shadow-default px-6 pt-6 pb-7 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservation Summary</h2>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Check in</p>
                  <p className="font-medium text-[#557df4]">{formatDateTime(formData.scheduleDatetime[0])}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Check out</p>
                  <p className="font-medium text-[#557df4]">{formatDateTime(formData.scheduleDatetime[1])}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Total Duration</p>
                  <p className="font-medium text-[#557df4]">{formatTotalHours(calculateTotalHours())}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Price Per Hour</p>
                  <p className="font-medium text-[#557df4]">฿{formatPrice(schedule.pricePerHour)}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-900">Total Price</p>
                  <p className="font-medium text-[#557df4]">฿{formatPrice(calculateTotalPrice())}</p>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <p className="font-medium text-gray-900">Vehicle</p>
                  <p className="font-medium text-[#557df4]">{selectedVehicleLicensePlateOption}</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePreviousStep}
                    className="block w-full rounded-full py-2 text-center font-medium text-slate-500 border-2 border-stroke bg-white hover:bg-gray-100">
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedPaymentMethodOption}
                    className={`block w-full rounded-full py-2 text-center font-medium text-white border-2 border-[#557df4] bg-[#557df4] hover:bg-[#4166e0] ${!selectedPaymentMethodOption ? 'opacity-50' : '' }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      )}

      {currentStep === 3 && (
      <div>
        <div className="w-full lg:w-4/5 xl:w-3/5 rounded-lg border border-stroke bg-white shadow-default px-6 pt-6 pb-7 mx-auto">
              
          <div className="text-[#17c653] bg-[#effff4] px-6 py-8 -mx-6 -my-6 mb-8">
            <div className="flex items-center gap-6">
              <CircleCheckBig className="w-12 h-12" strokeWidth={2}/>
              <h2 className="text-2xl font-semibold">Your reservation is complete</h2>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservation ID: #123</h2>

          <p className="font-bold text-gray-900 mb-3">Parking</p>

          <div className="flex items-center gap-3 mb-3">
            <SquareParking className="w-5 h-5 text-gray-400" />
            <p>{schedule.spotName}</p>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p>{schedule.spotAddress}</p>
          </div>

          <p className="font-bold text-gray-900 mt-6 mb-3">Duration</p>

          <div className="flex items-center gap-4 mb-3">
            <p><span className="font-bold">Check in: </span>{formatDateTime(formData.scheduleDatetime[0])}</p>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <p><span className="font-bold">Check out: </span>{formatDateTime(formData.scheduleDatetime[1])}</p>
          </div>

          <div className="flex items-center gap-4">
            <p><span className="font-bold">Total: </span>{formatTotalHours(calculateTotalHours())}</p>
          </div>

          <p className="font-bold text-gray-900 mt-6 mb-3">Payment</p>

          <div className="flex items-center gap-4 mb-3">
            <p><span className="font-bold">Amount: </span>฿{formatPrice(calculateTotalPrice())}</p>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <p><span className="font-bold">Medthod: </span>{selectedPaymentMethodOption}</p>
          </div>

          <p className="font-bold text-gray-900 mt-6 mb-3">Your Vehicle</p>

          <div className="flex items-center gap-4 mb-3">
            <p>{selectedVehicleLicensePlateOption}</p>
          </div>

          <NavLink
            to={`/reservations/${reservationId}`}
            className="block w-full rounded-full py-2 text-center font-medium text-white border-2 border-[#557df4] bg-[#557df4] hover:bg-[#4166e0] mt-10"
          >
            <p>View More Details</p>
          </NavLink>

          <NavLink
            to={`/`}
            className="block text-center text-slate-500 hover:underline mt-5"
          >
            <p>Back to Homepage</p>
          </NavLink>

        </div>
      </div>
      )}
    </>
  );
};

export default ScheduleReserve;