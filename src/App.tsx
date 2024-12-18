import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import { BASE_URL } from './config.js';

import HomeIndex from './pages/Public/HomeIndex';
import SearchIndex from './pages/Public/SearchIndex';
import ProfileIndex from './pages/Public/ProfileIndex';
import AboutIndex from './pages/Public/AboutIndex';
import ContactIndex from './pages/Public/ContactIndex';
import TermsIndex from './pages/Public/TermsIndex';
import PrivacyIndex from './pages/Public/PrivacyIndex';
import SettingIndex from './pages/Settings/SettingIndex';

import SpotShow from './pages/Spots/SpotShow';
import ScheduleShow from './pages/Schedules/ScheduleShow';
import ScheduleReserve from './pages/Schedules/ScheduleReserve';
import VehicleIndex from './pages/Vehicles/VehicleIndex.js';
import VehicleCreate from './pages/Vehicles/VehicleCreate.js';
import VehicleEdit from './pages/Vehicles/VehicleEdit.js';
import ReservationIndex from './pages/Reservations/ReservationIndex';
import ReservationShow from './pages/Reservations/ReservationShow';
import ReservationEdit from './pages/Reservations/ReservationEdit';
import ReservationReview from './pages/Reservations/ReservationReview';
import BookmarkIndex from './pages/Bookmarks/BookmarkIndex';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [chechAuth, setChechAuth] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const validateAuth = async () => {
      const publicPaths = ['/', '/search', '/about', '/contact', '/terms', '/privacy'];

      if (publicPaths.includes(pathname) || 
          pathname.match(/^\/schedule\/\d+$/) ||
          pathname.match(/^\/spot\/\d+$/) ||
          pathname.match(/^\/user\/[^/]+$/)
      ) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/checkAuth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        window.location.href = `${BASE_URL}/login`;
      } else {
        const data = await response.json();

        if(data == true) {
          setChechAuth(true);
        } else {
          window.location.href = `${BASE_URL}/login`;
        }
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    const validateRole = async () => {

      if(chechAuth) {
        const response = await fetch(`${BASE_URL}/checkRole`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
  
        if (!response.ok) {
          window.location.href = `${BASE_URL}/login`;
        } else {
          const data = await response.json();
  
          if(data == true) {
            window.location.href = `${BASE_URL}/admin`;
          }
        }
      }
    };

    validateRole();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <ToastContainer />
      <PageRoutes />
    </DefaultLayout>
  );
}

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};

function UserProfile() {
  const { username } = useParams();
  return (
    <>
      <PageTitle title={username || 'User Profile'} />
      <ProfileIndex />
    </>
  );
}

const PageRoutes = () => (
  <Routes>

    {/* Public */}
    <Route
      index
      element={
        <>
          <PageTitle title="CarBNB" />
          <HomeIndex />
        </>
      }
    />
    <Route
      path="/search"
      element={
        <>
          <PageTitle title="Parking Vehicles" />
          <SearchIndex />
        </>
      }
    />
    <Route
      path="/user/:username"
      element={<UserProfile />}
    />
    <Route
      path="/about"
      element={
        <>
          <PageTitle title="About Us" />
          <AboutIndex />
        </>
      }
    />
    <Route
      path="/contact"
      element={
        <>
          <PageTitle title="Contact Us" />
          <ContactIndex />
        </>
      }
    />
    <Route
      path="/terms"
      element={
        <>
          <PageTitle title="Terms of Service" />
          <TermsIndex />
        </>
      }
    />
    <Route
      path="/privacy"
      element={
        <>
          <PageTitle title="Privacy Policy" />
          <PrivacyIndex />
        </>
      }
    />

    {/* Settings */}
    <Route
      path="/settings"
      element={
        <>
          <PageTitle title="Settings" />
          <SettingIndex />
        </>
      }
    />

    {/* Spots */}
    <Route
      path="/spot/:id"
      element={
        <>
          <PageTitle title="Parking Spot" />
          <SpotShow />
        </>
      }
    />

    {/* Schedules */}
    <Route
      path="/schedule/:id"
      element={
        <>
          <PageTitle title="Schedule" />
          <ScheduleShow />
        </>
      }
    />
    <Route
      path="/schedule/:id/reserve"
      element={
        <>
          <PageTitle title="Schedule" />
          <ScheduleReserve />
        </>
      }
    />

    {/* Vehicles */}
    <Route
      path="/vehicles"
      element={
        <>
          <PageTitle title="Vehicles" />
          <VehicleIndex />
        </>
      }
    />
    <Route
      path="/vehicles/create"
      element={
        <>
          <PageTitle title="Add Vehicle" />
          <VehicleCreate />
        </>
      }
    />
    <Route
      path="/vehicles/:id/edit"
      element={
        <>
          <PageTitle title="Edit Vehicle" />
          <VehicleEdit />
        </>
      }
    />

    {/* Reservations */}
    <Route
      path="/reservations"
      element={
        <>
          <PageTitle title="Reservations" />
          <ReservationIndex />
        </>
      }
    />
    <Route
      path="/reservations/:id"
      element={
        <>
          <PageTitle title="Reservation Details" />
          <ReservationShow />
        </>
      }
    />
    <Route
      path="/reservations/:id/edit"
      element={
        <>
          <PageTitle title="Change Vehicle" />
          <ReservationEdit />
        </>
      }
    />
    <Route
      path="/reservations/:id/review"
      element={
        <>
          <PageTitle title="Review Reservation" />
          <ReservationReview />
        </>
      }
    />

    {/* Bookmarks */}
    <Route
      path="/bookmarks"
      element={
        <>
          <PageTitle title="Bookmarks" />
          <BookmarkIndex />
        </>
      }
    />

    
    <Route
      path="*"
      element={
        <>
           <NotFoundRedirect />
        </>
      }
    />

  </Routes>
);

export default App;
