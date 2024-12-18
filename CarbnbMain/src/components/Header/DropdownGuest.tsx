import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ClickOutside from '../ClickOutside.js';
import { BASE_URL } from '../../config.js';

const DropdownUser = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
    <div className="block lg:hidden">
      <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
        <Link
          onClick={handleDropdownClick}
          className="flex items-center gap-4"
          to="#"
        >
          <span className="user-image h-12 w-12 rounded-full">
            <img
              src="/src/images/userImage.png"
              alt="image"
            />
          </span>
        </Link>

        {/* <!-- Dropdown Start --> */}
        {dropdownOpen && (
          <div
            className={`absolute right-0 mt-2 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default`}
          >
            <ul className="flex flex-col py-3">
              <li>
                <Link
                  to={`${BASE_URL}/login`}
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out px-6 py-3 hover:bg-gray-100 lg:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to={`${BASE_URL}/register`}
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out px-6 py-3 hover:bg-gray-100 lg:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </ClickOutside>
    </div>

    <div className="hidden lg:block">
      <div className="flex items-center gap-2.5 min-w-full">
        
        <NavLink
          to={`${BASE_URL}/login`}
          className="flex items-center justify-center cursor-pointer w-[8rem] gap-3.5 rounded-full py-3 text-center font-medium text-gray-800 hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          <span>Sign in</span>
        </NavLink>

        <NavLink
          to={`${BASE_URL}/register`}
          className="flex items-center justify-center cursor-pointer w-[10rem] gap-3.5 rounded-full py-3 text-center font-medium text-white bg-[#557df4] hover:bg-[#4166e0]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          <span>Sign up</span>
        </NavLink>
      </div>
    </div>
    </>
  );
};

export default DropdownUser;
