import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';

interface User {
  balance: string;
}

const WithdrawalCreate = () => {
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    account: ''
  });

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
          setUser(data);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        throw new Error('An unknown error occurred');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      if(parseFloat(formData.amount) < 100) {
        toast.error('The minimum withdrawal amount is ฿100');
        return;
      }

      if(parseFloat(formData.amount) > parseFloat(user?.balance || '0')) {
        toast.error('Insufficient balance');
        return;
      }

      const formDataToSend = new FormData();
      
      const jsonData = {
        amount: parseFloat(formData.amount),
        method: formData.method,
        account: formData.account
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('withdrawal', jsonBlob);

      const response = await fetch(`${BASE_URL}/member/withdrawals/store`, {
        method: "POST",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const created = await response.json();

        if(created == true) {
          navigate('/withdrawals');
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

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
  };

  return (
    <>
      <Breadcrumb pageName="Withdraw Funds" />

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-7">
            <div className="mb-2 flex flex-col gap-7 xl:flex-row">
              <div className="w-full xl:w-1/2">

                <div className="mb-7">
                  <label className="mb-2.5 block text-black">
                    Method <span className="text-meta-1">*</span>
                  </label>

                  <div className="relative z-20 bg-transparent">
                    <select
                      name="method"
                      value={selectedOption}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        setFormData(prev => ({ ...prev, method: e.target.value }));
                        changeTextColor();
                      }}
                      required
                      className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-gray-400 active:border-gray-400
                        ${isOptionSelected ? 'text-black' : ''}`}
                    >
                      <option value="" disabled className="text-body">Select method</option>
                      <option value="wu" className="text-body">Western Union</option>
                      <option value="paypal" className="text-body">Paypal</option>
                      <option value="payoneer" className="text-body">Payoneer</option>
                      <option value="true" className="text-body">True Money Wallet</option>
                      <option value="usdt" className="text-body">USDT</option>
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

                <div className="mb-7">
                  <label className="mb-2.5 block text-black">
                    Account <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="account"
                    value={formData.account}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter account"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black">
                    Amount <span className="text-meta-1">*</span>
                  </label>
                  <CurrencyInput
                    name="amount"
                    value={formData.amount}
                    onValueChange={(value = '') => {
                      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
                      setFormData({
                        ...formData,
                        amount: isNaN(numericValue) ? '' : value,
                      });
                    }}
                    prefix="฿"
                    decimalsLimit={2}
                    required
                    placeholder="Enter amount"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"        
                  />
                  <p className="text-slate-500 text-sm mt-3">Your Remaining Balance: ฿{formatPrice(user?.balance ?? 0)}</p>
                </div>

                <button className="flex justify-center rounded-full bg-gray-900 py-3 px-12 mt-10 font-medium text-white hover:bg-opacity-90">
                  Submit
                </button>
              </div>
                  
              <div className="w-full xl:w-1/2">
                <div className="border-r border-l border-t m-0 my-2 xl:ml-6 xl:mr-2">
                  <table className="w-full table-auto table-border">
                  <thead>
                    <tr className="bg-gray-2 text-left border-b">
                      <th className="w-3/6 py-4 px-4 font-medium text-black sm:pl-6 lg:pl-10">
                        Method
                      </th>
                      <th className="w-3/6 py-4 px-4 font-medium text-black">
                        Account
                      </th>
                    </tr>
                  </thead>
                    <tbody>
                      <tr>
                        <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">Western Union</td>
                        <td className="border-b py-5 px-4 sm:pl-6">Enter your account ID</td>
                      </tr>
                      <tr>
                        <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">Paypal</td>
                        <td className="border-b py-5 px-4 sm:pl-6">Enter your email</td>
                      </tr>
                      <tr>
                        <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">Payoneer</td>
                        <td className="border-b py-5 px-4 sm:pl-6">Enter your email</td>
                      </tr>
                      <tr>
                        <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">True Money Wallet</td>
                        <td className="border-b py-5 px-4 sm:pl-6">Enter your phone number</td>
                      </tr>
                      <tr>
                        <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">USDT</td>
                        <td className="border-b py-5 px-4 sm:pl-6">Enter your key</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default WithdrawalCreate;