import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropdownUser from './DropdownUser';
import DropdownGuest from './DropdownGuest';
import LogoIcon from '../../images/logo/logo.png';
import { BASE_URL } from '../../config.js';

const Header = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [checkAuth, setCheckAuth] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const validateAuth = async () => {
      const response = await fetch(`${BASE_URL}/checkAuth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();

        if(data == true) {
          setCheckAuth(true);
        }
      }
    };

    validateAuth();
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 shadow-2">
      <div className="container mx-auto flex flex-grow items-center justify-between py-4 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        

        <Link className="flex-shrink-0" to="/">
          <img src={LogoIcon} alt="Logo" width="120" />
        </Link>

        
        <div className={`relative hidden lg:block ${location.pathname === '/' ? 'invisible' : ''}`}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="q"
              id="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-[30rem] rounded-full border-[1.5px] border-stroke bg-transparent py-3 px-6 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
            />
            <button type="submit" className="absolute right-6 top-2/4 -translate-y-1/2 cursor-pointer">
              <svg className="fill-gray-400 hover:fill-gray-600" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" fill=""></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" fill=""></path>
              </svg>
            </button>
            
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-4 xsm:gap-5 sm:gap-6 md:gap-7">

          {location.pathname !== '/' && (
          <Link to="/search" className="cursor-pointer lg:hidden">
              <svg className="fill-gray-400 hover:fill-gray-600" width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" fill=""></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" fill=""></path>
              </svg>
          </Link>
          )}

          {/* <!-- User Area --> */}
          {checkAuth ? (
            <DropdownUser />
          ) : (
            <DropdownGuest />
          )}
            
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
