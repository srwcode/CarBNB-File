import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState, useRef } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const SpotEdit = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    address: '',
    description: '',
    sizeWidth: '',
    sizeLength: '',
    sizeHeight: '',
    imagePath: ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageDeleted, setIsImageDeleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/spots/show/${id}`, {
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
            name: data.name,
            type: data.type.toString(),
            location: data.location,
            address: data.address,
            description: data.description,
            sizeWidth: data.sizeWidth,
            sizeLength: data.sizeLength,
            sizeHeight: data.sizeHeight,
            imagePath: data.imagePath
          });
          setSelectedOption(data.type.toString());
          setIsOptionSelected(true);

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

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

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
        name: formData.name,
        type: parseInt(selectedOption),
        location: formData.location,
        address: formData.address,
        description: formData.description,
        sizeWidth: formData.sizeWidth,
        sizeLength: formData.sizeLength,
        sizeHeight: formData.sizeHeight
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('spot', jsonBlob);

      formDataToSend.append('deleteImage', isImageDeleted.toString());

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`${BASE_URL}/member/spots/update/${id}`, {
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
  
  return (
    <>
      <Breadcrumb pageName="Edit Parking Spot" />

      {error ? (
      <div className="display-error">
        {error}
      </div>
      ) : (
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-7">
            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <div className="mb-7">
                  <label className="mb-2.5 block text-black">
                    Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black">
                    Google Maps URL <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter location"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                  />
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
                  Address <span className="text-meta-1">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={6}
                  required
                  placeholder="Enter address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                ></textarea>
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

            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Type <span className="text-meta-1">*</span>
                </label>

                <div className="relative z-20 bg-transparent">
                  <select
                    name="type"
                    value={selectedOption}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setFormData(prev => ({ ...prev, type: e.target.value }));
                      changeTextColor();
                    }}
                    required
                    className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                      ${isOptionSelected ? 'text-black' : ''}`}
                  >
                    <option value="" disabled className="text-body">
                      Select type
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

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Width <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  name="sizeWidth"
                  value={formData.sizeWidth}
                  onChange={handleInputChange}
                  min="0.01"
                  step=".01"
                  required
                  placeholder="Enter width"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>
            </div>

            <div className="mb-7 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Length <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  name="sizeLength"
                  value={formData.sizeLength}
                  onChange={handleInputChange}
                  min="0.01"
                  step=".01"
                  required
                  placeholder="Enter length"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black">
                  Height
                </label>
                <input
                  type="number"
                  name="sizeHeight"
                  value={formData.sizeHeight}
                  onChange={handleInputChange}
                  min="0.01"
                  step=".01"
                  placeholder="Enter height"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>
            </div>

            <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 mt-10 font-medium text-white hover:bg-opacity-90">
              Submit
            </button>
          </div>
        </form>
      </div>
      )}
    </>
  );
};

export default SpotEdit;