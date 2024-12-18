import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE } from '../../config.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

const ReservationEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<string>('');

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

  const handleVehicleOptionChange = (vehicleId: string) => {
    console.log('Selected value:', vehicleId);
    setSelectedVehicleOption(vehicleId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/reservations/list/show/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const vehicleId = String(data.vehicle);

          setSelectedVehicleOption(vehicleId);
          console.log('Initial vehicle set:', vehicleId);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        vehicle: parseInt(selectedVehicleOption)
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('reservation', jsonBlob);

      const response = await fetch(`${BASE_URL}/member/reservations/update/${id}`, {
        method: "PUT",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const updated = await response.json();

        if(updated == true) {
          navigate(`/reservations/${id}`);
          toast.success('Updated successfully');
        } else {
          toast.error('Failed to update');
        }
      } else {
        console.error("Failed to update:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      {error ? (
        <div className="display-error">
          {error}
        </div>
      ) : (
        <div className="max-w-[50rem] mx-auto">
          <h2 className="text-title-md2 font-semibold text-black mb-8">Change Vehicle</h2>

          <form onSubmit={handleSubmit}>
            <div className="w-full mb-7">

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 mb-12">
                {vehicles.map((vehicle) => {
                  const vehicleIdString = String(vehicle.vehicleId);
                  const isSelected = vehicleIdString === selectedVehicleOption;
                  
                  return (
                    <div 
                      key={vehicleIdString}
                      onClick={() => handleVehicleOptionChange(vehicleIdString)}
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

            <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 font-medium text-white hover:bg-opacity-90">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ReservationEdit;