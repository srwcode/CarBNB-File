import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { useEffect, useState, useRef } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const VehicleEdit = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    licensePlate: '',
    province: '',
    brand: '',
    model: '',
    color: '',
    imagePath: ''
  });

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTypeOption, setSelectedTypeOption] = useState<string>('');
  const [isTypeOptionSelected, setIsTypeOptionSelected] = useState<boolean>(false);
  const [selectedColorOption, setSelectedColorOption] = useState<string>('');
  const [isColorOptionSelected, setIsColorOptionSelected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageDeleted, setIsImageDeleted] = useState<boolean>(false);

  const handleTypeOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedTypeOption(value);
    setFormData(prev => ({ ...prev, type: value }));
    changeTextColor('type');
  };

  const handleColorOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedColorOption(value);
    setFormData(prev => ({ ...prev, color: value }));
    changeTextColor('color');
  };

  const changeTextColor = (type: 'type' | 'color') => {
    if (type === 'type') {
      setIsTypeOptionSelected(true);
    } else {
      setIsColorOptionSelected(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/vehicles/show/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            vehicleId: data.vehicleId,
            type: data.type,
            licensePlate: data.licensePlate,
            province: data.province,
            brand: data.brand,
            model: data.model,
            color: data.color,
            imagePath: data.imagePath
          });

          setSelectedTypeOption(data.type);
          setIsTypeOptionSelected(true);

          setSelectedColorOption(data.color);
          setIsColorOptionSelected(true);

          if (data.imagePath) {
            setPreviewUrl(`${BASE_URL}/${data.imagePath}`);
          }
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setIsImageDeleted(false);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setIsImageDeleted(false);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsImageDeleted(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        type: selectedTypeOption,
        licensePlate: formData.licensePlate,
        province: formData.province,
        brand: formData.brand,
        model: formData.model,
        color: selectedColorOption
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('vehicle', jsonBlob);

      formDataToSend.append('deleteImage', isImageDeleted.toString());

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`${BASE_URL}/member/vehicles/update/${id}`, {
        method: "PUT",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const updated = await response.json();

        if(updated == true) {
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

  const handleDelete = async (id: string) => {

    const isConfirmed = window.confirm('Are you sure you want to delete?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/member/vehicles/remove/${id}`, {
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
          navigate('/vehicles');
          toast.success('Deleted successfully');
        } else {
          toast.error('Failed to delete');
        }
      } else {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  return (
    <>
      <Breadcrumb pageName="Edit Vehicle" />

      {error ? (
      <div className="display-error">
        {error}
      </div>
      ) : (
      <div className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-7 flex flex-col gap-7 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <div className="mb-7">
                <label className="mb-2.5 block text-black">
                  License Plate <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter license plate"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black">
                  Province <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter province"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                  list="province-options"
                  autoComplete="off"
                />
                {formData.province.length >= 2 && (
                <datalist id="province-options">
                  <option value="Bangkok"></option>
                  <option value="Samut Prakan"></option>
                  <option value="Nonthaburi"></option>
                  <option value="Pathum Thani"></option>
                  <option value="Phra Nakhon Si Ayutthaya"></option>
                  <option value="Ang Thong"></option>
                  <option value="Lopburi"></option>
                  <option value="Sing Buri"></option>
                  <option value="Chai Nat"></option>
                  <option value="Saraburi"></option>
                  <option value="Chonburi"></option>
                  <option value="Rayong"></option>
                  <option value="Chanthaburi"></option>
                  <option value="Trat"></option>
                  <option value="Chachoengsao"></option>
                  <option value="Prachinburi"></option>
                  <option value="Nakhon Nayok"></option>
                  <option value="Sa Kaeo"></option>
                  <option value="Nakhon Ratchasima"></option>
                  <option value="Buri Ram"></option>
                  <option value="Surin"></option>
                  <option value="Si Sa Ket"></option>
                  <option value="Ubon Ratchathani"></option>
                  <option value="Yasothon"></option>
                  <option value="Chaiyaphum"></option>
                  <option value="Amnat Charoen"></option>
                  <option value="Bueng Kan"></option>
                  <option value="Nong Bua Lam Phu"></option>
                  <option value="Khon Kaen"></option>
                  <option value="Udon Thani"></option>
                  <option value="Loei"></option>
                  <option value="Nong Khai"></option>
                  <option value="Maha Sarakham"></option>
                  <option value="Roi Et"></option>
                  <option value="Kalasin"></option>
                  <option value="Sakon Nakhon"></option>
                  <option value="Nakhon Phanom"></option>
                  <option value="Mukdahan"></option>
                  <option value="Chiang Mai"></option>
                  <option value="Lamphun"></option>
                  <option value="Lampang"></option>
                  <option value="Uttaradit"></option>
                  <option value="Phrae"></option>
                  <option value="Nan"></option>
                  <option value="Phayao"></option>
                  <option value="Chiang Rai"></option>
                  <option value="Mae Hong Son"></option>
                  <option value="Nakhon Sawan"></option>
                  <option value="Uthai Thani"></option>
                  <option value="Kamphaeng Phet"></option>
                  <option value="Tak"></option>
                  <option value="Sukhothai"></option>
                  <option value="Phitsanulok"></option>
                  <option value="Phichit"></option>
                  <option value="Phetchabun"></option>
                  <option value="Ratchaburi"></option>
                  <option value="Kanchanaburi"></option>
                  <option value="Suphan Buri"></option>
                  <option value="Nakhon Pathom"></option>
                  <option value="Samut Sakhon"></option>
                  <option value="Samut Songkhram"></option>
                  <option value="Phetchaburi"></option>
                  <option value="Prachuap Khiri Khan"></option>
                  <option value="Chumphon"></option>
                  <option value="Ranong"></option>
                  <option value="Surat Thani"></option>
                  <option value="Phang Nga"></option>
                  <option value="Phuket"></option>
                  <option value="Krabi"></option>
                  <option value="Nakhon Si Thammarat"></option>
                  <option value="Trang"></option>
                  <option value="Phatthalung"></option>
                  <option value="Songkhla"></option>
                  <option value="Satun"></option>
                  <option value="Pattani"></option>
                  <option value="Yala"></option>
                  <option value="Narathiwat"></option>
                </datalist>
                )}
              </div>
            </div>
                
            <div className="image-upload w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="h-[158px] w-full rounded-lg border-2 border-dashed border-gray-300 bg-transparent hover:bg-gray-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                />
                <label 
                  htmlFor="fileInput" 
                  className="flex h-full w-full items-center justify-center p-4 cursor-pointer"
                >
                  {previewUrl ? (
                    <div className="relative h-full w-full">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="absolute left-2/4 -translate-x-1/2"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute right-2 rounded-full p-1 text-white bg-red-500 hover:bg-red-600"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-10 w-10 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="mt-3 text-sm font-medium">
                        <p className="text-gray-600 inline">Drop your file here or </p>
                        <span className="text-blue-600 hover:text-blue-800 hover:underline">browse</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Pick a file up to 10MB.</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-7 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Type <span className="text-meta-1">*</span>
              </label>

              <div className="relative z-20 bg-transparent">
                <select
                  name="type"
                  value={selectedTypeOption}
                  onChange={handleTypeOptionChange}
                  required
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                    ${isTypeOptionSelected ? 'text-black' : ''}`}
                >
                  <option value="" disabled className="text-body">Select type</option>
                  <option value="sedan" className="text-body">Sedan</option>
                  <option value="coupe" className="text-body">Coupe</option>
                  <option value="hatchback" className="text-body">Hatchback</option>
                  <option value="crossover" className="text-body">Crossover</option>
                  <option value="suv" className="text-body">SUV</option>
                  <option value="ppv" className="text-body">PPV</option>
                  <option value="pickup" className="text-body">Pickup</option>
                  <option value="wagon" className="text-body">Wagon</option>
                  <option value="offroad" className="text-body">Off-road</option>
                  <option value="sports" className="text-body">Sports</option>
                  <option value="micro" className="text-body">Micro</option>
                  <option value="van" className="text-body">Van</option>
                  <option value="mpv" className="text-body">MPV</option>
                  <option value="convertible" className="text-body">Convertible</option>
                  <option value="muscle" className="text-body">Muscle</option>
                  <option value="limousine" className="text-body">Limousine</option>
                  <option value="motorcycle_standard" className="text-body">Standard (Motorcycle)</option>
                  <option value="motorcycle_cruiser" className="text-body">Cruiser (Motorcycle)</option>
                  <option value="motorcycle_touring" className="text-body">Touring (Motorcycle)</option>
                  <option value="motorcycle_sport" className="text-body">Sport (Motorcycle)</option>
                  <option value="motorcycle_offroad" className="text-body">Off-road (Motorcycle)</option>
                  <option value="motorcycle_dualpurpose" className="text-body">Dual-purpose (Motorcycle)</option>
                  <option value="motorcycle_sporttouring" className="text-body">Sport Touring (Motorcycle)</option>
                  <option value="motorcycle_scooter" className="text-body">Scooter (Motorcycle)</option>
                  <option value="other" className="text-body">Other</option>
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
                Color <span className="text-meta-1">*</span>
              </label>

              <div className="relative z-20 bg-transparent">
                <select
                  name="color"
                  value={selectedColorOption}
                  onChange={handleColorOptionChange}
                  required
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                    ${isColorOptionSelected ? 'text-black' : ''}`}
                >
                  <option value="" disabled className="text-body">Select color</option>
                  <option value="white" className="text-body">White</option>
                  <option value="black" className="text-body">Black</option>
                  <option value="silver" className="text-body">Silver</option>
                  <option value="red" className="text-body">Red</option>
                  <option value="blue" className="text-body">Blue</option>
                  <option value="grey" className="text-body">Grey</option>
                  <option value="green" className="text-body">Green</option>
                  <option value="yellow" className="text-body">Yellow</option>
                  <option value="orange" className="text-body">Orange</option>
                  <option value="brown" className="text-body">Brown</option>
                  <option value="purple" className="text-body">Purple</option>
                  <option value="pink" className="text-body">Pink</option>
                  <option value="beige" className="text-body">Beige</option>
                  <option value="gold" className="text-body">Gold</option>
                  <option value="champagne" className="text-body">Champagne</option>
                  <option value="maroon" className="text-body">Maroon</option>
                  <option value="turquoise" className="text-body">Turquoise</option>
                  <option value="other" className="text-body">Other</option>
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
          </div>

          <div className="mb-7 flex flex-col gap-7 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Brand <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="Enter brand"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                list="brand-options"
                autoComplete="off"
              />
              {formData.brand.length >= 2 && (
              <datalist id="brand-options">
                <option value="Honda"></option>
                <option value="Toyota"></option>
                <option value="Mazda"></option>
                <option value="BMW"></option>
                <option value="Ford"></option>
                <option value="Chevrolet"></option>
                <option value="Nissan"></option>
                <option value="Mercedes-Benz"></option>
                <option value="Audi"></option>
                <option value="Volkswagen"></option>
                <option value="Hyundai"></option>
                <option value="Kia"></option>
                <option value="Porsche"></option>
                <option value="Lexus"></option>
                <option value="Subaru"></option>
                <option value="Jeep"></option>
                <option value="Chrysler"></option>
                <option value="Tesla"></option>
                <option value="Ferrari"></option>
                <option value="Lamborghini"></option>
                <option value="Aston Martin"></option>
                <option value="Rolls-Royce"></option>
                <option value="Bentley"></option>
                <option value="Jaguar"></option>
                <option value="Land Rover"></option>
                <option value="Yamaha"></option>
                <option value="Kawasaki"></option>
                <option value="Suzuki"></option>
                <option value="Harley-Davidson"></option>
                <option value="Ducati"></option>
                <option value="Triumph"></option>
                <option value="KTM"></option>
                <option value="Royal Enfield"></option>
                <option value="Moto Guzzi"></option>
                <option value="Aprilia"></option>
                <option value="MV Agusta"></option>
              </datalist>
              )}
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Model <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                placeholder="Enter model"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 font-medium text-white hover:bg-opacity-90">
              Submit
            </button>

            <button
              className="flex justify-center rounded-full border border-red-500 py-3 px-12 font-medium text-red-500 hover:bg-red-50"
              onClick={(e) => { 
                e.preventDefault();
                handleDelete(formData.vehicleId);
              }}
            >
              Delete
            </button>
          </div>
          
        </form>
      </div>
      )}
    </>
  );
};

export default VehicleEdit;