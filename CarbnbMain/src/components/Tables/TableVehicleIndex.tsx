import { useEffect, useState } from 'react';
import { BASE_URL, PerPage, DEFAULT_IMAGE } from '../../config.js';
import { NavLink } from 'react-router-dom';

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

const TableVehicleIndex = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/vehicles/index`, {
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
        setVehicles(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = vehicles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  return (
    <div>
        <div className="flex justify-between items-center gap-2 mb-8">
          <h2 className="text-title-md2 font-semibold text-black">My Vehicles</h2>

          <NavLink
            to="/vehicles/create"
            className="flex items-center justify-center gap-2.5 rounded-full py-2 px-6 -my-0.5 text-center font-medium text-white bg-[#557df4] hover:bg-[#4166e0]"
          >
            <svg className="fill-current" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"></path>
            </svg>
            Add
          </NavLink>
        </div>

      {vehicles.length === 0 ? (
        <div className="max-w-full py-40 px-4 text-center">
          <p>No data found</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:gap-8 mb-8">
            {currentVehicles.map((vehicle, key) => (
                <div key={key}>
                <NavLink to={`/vehicles/${vehicle.vehicleId}/edit`}>
                  <div className="border-2 border-stroke bg-white shadow-default hover:bg-gray-100 rounded px-8 py-6 text-center">
                    <p className="text-title-sm font-bold text-black">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-lg text-slate-500 mt-2.5">
                      {vehicle.type == 'sedan' ? 'Sedan' :
                      vehicle.type == 'coupe' ? 'Coupe' :
                      vehicle.type == 'hatchback' ? 'Hatchback' :
                      vehicle.type == 'crossover' ? 'Crossover' :
                      vehicle.type == 'suv' ? 'SUV' :
                      vehicle.type == 'ppv' ? 'PPV' :
                      vehicle.type == 'pickup' ? 'Pickup' :
                      vehicle.type == 'wagon' ? 'Wagon' :
                      vehicle.type == 'offroad' ? 'Off-road' :
                      vehicle.type == 'sports' ? 'Sports' :
                      vehicle.type == 'micro' ? 'Micro' :
                      vehicle.type == 'van' ? 'Van' :
                      vehicle.type == 'mpv' ? 'MPV' :
                      vehicle.type == 'convertible' ? 'Convertible' :
                      vehicle.type == 'muscle' ? 'Muscle' :
                      vehicle.type == 'limousine' ? 'Limousine' :
                      vehicle.type == 'motorcycle_standard' ? 'Standard (Motorcycle)' :
                      vehicle.type == 'motorcycle_cruiser' ? 'Cruiser (Motorcycle)' :
                      vehicle.type == 'motorcycle_touring' ? 'Touring (Motorcycle)' :
                      vehicle.type == 'motorcycle_sport' ? 'Sport (Motorcycle)' :
                      vehicle.type == 'motorcycle_offroad' ? 'Off-road (Motorcycle)' :
                      vehicle.type == 'motorcycle_dualpurpose' ? 'Dual-purpose (Motorcycle)' :
                      vehicle.type == 'motorcycle_sporttouring' ? 'Sport Touring (Motorcycle)' :
                      vehicle.type == 'motorcycle_scooter' ? 'Scooter (Motorcycle)' :
                      vehicle.type == 'other' ? 'Other' : 'Unknown'}
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
                        src={`${DEFAULT_IMAGE}`} 
                        alt="Default image"
                      />
                      )}
                    </div>

                    <p className="text-lg text-black font-medium">{vehicle.licensePlate}</p>
                    <p className="text-lg text-slate-500 mt-2.5">{vehicle.province}</p>
                    <p className="text-lg text-slate-500 mt-2.5">
                      {vehicle.color == 'white' ? 'White' :
                      vehicle.color == 'black' ? 'Black' :
                      vehicle.color == 'silver' ? 'Silver' :
                      vehicle.color == 'red' ? 'Red' :
                      vehicle.color == 'blue' ? 'Blue' :
                      vehicle.color == 'grey' ? 'Grey' :
                      vehicle.color == 'green' ? 'Green' :
                      vehicle.color == 'yellow' ? 'Yellow' :
                      vehicle.color == 'orange' ? 'Orange' :
                      vehicle.color == 'brown' ? 'Brown' :
                      vehicle.color == 'purple' ? 'Purple' :
                      vehicle.color == 'pink' ? 'Pink' :
                      vehicle.color == 'beige' ? 'Beige' :
                      vehicle.color == 'gold' ? 'Gold' :
                      vehicle.color == 'champagne' ? 'Champagne' :
                      vehicle.color == 'maroon' ? 'Maroon' :
                      vehicle.color == 'turquoise' ? 'Turquoise' :
                      vehicle.color == 'other' ? 'Other' : 'Unknown'}
                    </p>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm ${currentPage === 1 ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm lg:text-base text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, vehicles.length)} of{' '} {vehicles.length} results
              </p>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 ${currentPage === 1 ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => handlePageChange(pageIndex + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-gray-900 text-sm ring-1 ring-inset ring-gray-300 ${currentPage === pageIndex + 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-900 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableVehicleIndex;