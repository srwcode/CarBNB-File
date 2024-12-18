import { useEffect, useState } from 'react';
import { BASE_URL, PerPage } from '../../config.js';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface User {
  balance: string;
}

interface Withdrawal {
  id: string;
  status: string;
  amount: string;
  method: string;
  account: string;
  createdAt: string;
}

const TableWithdrawalIndex = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PerPage;

  const [user, setUser] = useState<User | null>(null);
  const [sumPending, setSumPending] = useState(0);
  const [sumCompleted, setSumCompleted] = useState(0);
  const [sumCanceled, setSumCanceled] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/member/withdrawals/index`, {
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
        setWithdrawals(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));

        setSumPending(
          data
            .filter((w: Withdrawal) => w.status == '1')
            .reduce((sum: number, w: Withdrawal) => sum + parseFloat(w.amount), 0)
            .toString()
        );
        
        setSumCompleted(
          data
            .filter((w: Withdrawal) => w.status == '2')
            .reduce((sum: number, w: Withdrawal) => sum + parseFloat(w.amount), 0)
            .toString()
        );
        
        setSumCanceled(
          data
            .filter((w: Withdrawal) => w.status == '3')
            .reduce((sum: number, w: Withdrawal) => sum + parseFloat(w.amount), 0)
            .toString()
        );
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWithdrawals = withdrawals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = parseISO(isoString);
    return format(date, "dd MMM yyyy (HH:mm)");
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US').format(Number(price));
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
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-7">
        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(user?.balance ?? 0)}</p>
          <p className="text-slate-500 mt-2.5">Remaining Balance</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(sumPending)}</p>
          <p className="text-slate-500 mt-2.5">Pending Withdrawal</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(sumCompleted)}</p>
          <p className="text-slate-500 mt-2.5">Completed Withdrawal</p>
        </div>

        <div className="bg-white shadow-default border border-stroke rounded-sm px-8 py-6">
          <p className="text-title-lg font-bold text-black">฿{formatPrice(sumCanceled)}</p>
          <p className="text-slate-500 mt-2.5">Canceled Withdrawal</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="border-b-2 py-5 px-4 sm:pl-6 lg:pl-10 lg:pr-6">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-lg font-bold text-black">List of Withdrawals</h4>

            <NavLink
              to="/withdrawals/create"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2 px-6 -my-0.5 text-sm text-center font-medium text-gray-900 hover:bg-gray-50"
            >
              <svg className="fill-current" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"></path>
              </svg>
              Withdraw Funds
            </NavLink>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="max-w-full py-40 px-4 text-center">
            <p>No data found</p>
          </div>
        ) : (
          <div>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto table-border">
                <thead>
                  <tr className="bg-gray-2 text-left border-b">
                    <th className="w-[15%] py-4 px-4 font-medium text-black sm:pl-6 lg:pl-10">
                      Transaction ID
                    </th>
                    <th className="w-[20%] py-4 px-4 font-medium text-black">
                      Withdrawal Date
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Status
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Amount
                    </th>
                    <th className="w-[15%] py-4 px-4 font-medium text-black">
                      Method
                    </th>
                    <th className="w-[20%] py-4 px-4 font-medium text-black">
                      Account
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentWithdrawals.map((withdrawal, key) => (
                  <tr key={key} className="hover:bg-gray-100">
                    <td className="border-b py-5 px-4 sm:pl-6 lg:pl-10">
                        <p>#{withdrawal.id}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p>{formatDateTime(withdrawal.createdAt)}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            withdrawal.status == '1' ? 'bg-warning text-warning'
                            : withdrawal.status == '2' ? 'bg-success text-success'
                            : withdrawal.status == '3' ? 'bg-danger text-danger'
                            : 'bg-black text-white'
                          }`}
                        >
                          {withdrawal.status == '1' ? 'Pending'
                          : withdrawal.status == '2' ? 'Completed'
                          : withdrawal.status == '3' ? 'Canceled'
                          : 'None'}
                        </p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p>฿{formatPrice(withdrawal.amount)}</p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p>
                          {withdrawal.method == 'wu' ? 'Western Union'
                          : withdrawal.method == 'paypal' ? 'Paypal'
                          : withdrawal.method == 'payoneer' ? 'Payoneer'
                          : withdrawal.method == 'true' ? 'True Money Wallet'
                          : withdrawal.method == 'usdt' ? 'USDT'
                          : 'None'}
                        </p>
                    </td>
                    <td className="border-b py-5 px-4">
                        <p>{withdrawal.account}</p>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
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
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, withdrawals.length)} of{' '} {withdrawals.length} results
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
                      className={`relative inline-flex items-center px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${currentPage === pageIndex + 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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
    </>
  );
};

export default TableWithdrawalIndex;