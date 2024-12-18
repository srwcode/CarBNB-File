import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

interface Spot {
  spotId: string;
  name: string;
}

const ScheduleCreate = () => {
  const [formData, setFormData] = useState({
    spot: '',
    pricePerHour: '',
    minimumHour: '1',
    charger: '',
    chargerPrice: '',
    description: '',
    scheduleDatetime: [] as string[],
  });

  const navigate = useNavigate();

  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpotOption, setSelectedSpotOption] = useState<string>('');
  const [isSpotOptionSelected, setIsSpotOptionSelected] = useState<boolean>(false);
  const [selectedChargerOption, setSelectedChargerOption] = useState<string>('');
  const [isChargerOptionSelected, setIsChargerOptionSelected] = useState<boolean>(true);
  const [charger, setCharger] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/spots/index`, {
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
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const handleSpotOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedSpotOption(value);
    setFormData(prev => ({ ...prev, spot: value }));
    changeTextColor('spot');
  };

  const handleChargerOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedChargerOption(value);
    setFormData(prev => ({ ...prev, charger: value }));
    changeTextColor('charger');
    setCharger(e.target.value);
  };

  const changeTextColor = (type: 'spot' | 'charger') => {
    if (type === 'spot') {
      setIsSpotOptionSelected(true);
    } else {
      setIsChargerOptionSelected(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.scheduleDatetime || formData.scheduleDatetime.length !== 2) {
      toast.error('Duration should not be empty');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        spot: parseInt(selectedSpotOption),
        pricePerHour: parseFloat(formData.pricePerHour),
        minimumHour: formData.minimumHour,
        charger: parseInt(selectedChargerOption),
        chargerPrice: parseFloat(formData.chargerPrice),
        description: formData.description,
        scheduleDatetime: formData.scheduleDatetime.length === 2
        ? `${new Date(formData.scheduleDatetime[0]).toLocaleDateString('en-GB')} ${new Date(formData.scheduleDatetime[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${new Date(formData.scheduleDatetime[1]).toLocaleDateString('en-GB')} ${new Date(formData.scheduleDatetime[1]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
        : ''
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('schedule', jsonBlob);

      const response = await fetch(`${BASE_URL}/member/schedules/store`, {
        method: "POST",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const created = await response.json();

        if(created == true) {
          navigate('/schedules');
          toast.success('Created successfully');
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

  return (
    <>
      <Breadcrumb pageName="Add Schedule" />

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-7">
            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Parking Spot <span className="text-meta-1">*</span>
                </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    name="spot"
                    value={selectedSpotOption}
                    onChange={handleSpotOptionChange}
                    required
                    className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                      ${isSpotOptionSelected ? 'text-black' : ''}`}
                  >
                    <option value="" disabled className="text-body">
                      Select parking spot
                    </option>
                    {spots.map(spot => (
                      <option key={spot.spotId} value={spot.spotId} className="text-body">
                        {spot.name}
                      </option>
                    ))}
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

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Duration <span className="text-meta-1">*</span>
                </label>
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
                />
              </div>
            </div>

            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Price Per Hour <span className="text-meta-1">*</span>
                </label>
                <CurrencyInput
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onValueChange={(value = '') => {
                    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
                    setFormData({
                      ...formData,
                      pricePerHour: isNaN(numericValue) ? '' : value,
                    });
                  }}
                  prefix="฿"
                  decimalsLimit={2}
                  required
                  placeholder="Enter price per hour"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"        
                />
              </div>
              
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Minimum Hour <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  name="minimumHour"
                  value={formData.minimumHour}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  step="1"
                  required
                  placeholder="Enter minimum hour"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>
            </div>

            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <div>
                  <label className="mb-2.5 block text-black">
                    Charger Service
                  </label>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="charger"
                      value={selectedChargerOption}
                      onChange={handleChargerOptionChange}
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isChargerOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" className="text-body">
                        No, I don't have charging service.
                      </option>
                      <option value="1" className="text-body">
                        Yes, I have charging service.
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

                {charger === "1" && (
                <div className="mt-7">
                  <label className="mb-2.5 block text-black">
                    Charger Price Per Hour
                  </label>
                  <CurrencyInput
                    name="chargerPrice"
                    value={formData.chargerPrice}
                    onValueChange={(value = '') => {
                      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
                      setFormData({
                        ...formData,
                        chargerPrice: isNaN(numericValue) ? '' : value,
                      });
                    }}
                    prefix="฿"
                    decimalsLimit={2}
                    required
                    placeholder="Enter price per hour"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"        
                  />
                </div>
                )}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Enter description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                ></textarea>
              </div>
            </div>

            <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 mt-10 font-medium text-white hover:bg-opacity-90">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleCreate;