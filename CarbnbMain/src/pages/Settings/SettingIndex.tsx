import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState, useRef } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';

const UserEdit = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    imagePath: '',

    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageDeleted, setIsImageDeleted] = useState<boolean>(false);
  const phoneRegex = /^\+?[0-9]{10,15}$/;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/users/index`, {
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
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            imagePath: data.imagePath,

            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword
          });

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
  }, []);

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

    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      toast.error('Phone number should be valid');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,

        password: formData.newPassword,
        confirmPassword: formData.confirmNewPassword,
        currentPassword: formData.currentPassword
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('user', jsonBlob);

      formDataToSend.append('deleteImage', isImageDeleted.toString());

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`${BASE_URL}/member/users/update`, {
        method: "PUT",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const updated = await response.json();

        if(updated == 1) {
          toast.success('Updated successfully');
        } else if (updated === 2) {
          toast.success('Password changed successfully');

          setFormData({
            ...formData,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });

        } else if (updated === 3) {
          toast.error('Current password is incorrect');
        } else if (updated === 4) {
          toast.error('Password should be between 6 and 100 characters');
        } else if (updated === 5) {
          toast.error('Password and confirm password do not match');
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
      <Breadcrumb pageName="Settings" />

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
                  Username <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter username"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                />
              </div>
            </div>
                
            <div className="user-image-upload w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Profile Image
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
                First Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter first name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
              />
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Last Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
              />
            </div>
          </div>

          <div className="w-full xl:w-1/2 mb-7 xl:pr-3.5">
            <label className="mb-2.5 block text-black">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
            />
          </div>

          <div className="border-b-2 pb-6 mb-6 mt-10">
            <h2 className="text-title-sm font-semibold text-black">Change Password</h2>
          </div>

          <div className="w-full xl:w-1/2 mb-7 xl:pr-3.5">
              <label className="mb-2.5 block text-black">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword || ""}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
              />
          </div>

          <div className="mb-7 flex flex-col gap-7 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword || ""}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
              />
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword || ""}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
              />
            </div>
          </div>

          <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 mt-10 font-medium text-white hover:bg-opacity-90">
            Submit
          </button>

        </form>
      </div>
      )}
    </>
  );
};

export default UserEdit;