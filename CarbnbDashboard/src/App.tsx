import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import { BASE_URL } from './config.js';

import DashboardIndex from './pages/Dashboard/DashboardIndex';
import SpotIndex from './pages/Spots/SpotIndex';
import SpotCreate from './pages/Spots/SpotCreate';
import SpotShow from './pages/Spots/SpotShow';
import SpotEdit from './pages/Spots/SpotEdit';
import ScheduleIndex from './pages/Schedules/ScheduleIndex';
import ScheduleCreate from './pages/Schedules/ScheduleCreate';
import ScheduleShow from './pages/Schedules/ScheduleShow';
import ScheduleEdit from './pages/Schedules/ScheduleEdit';
import ReservationIndex from './pages/Reservations/ReservationIndex';
import ReservationShow from './pages/Reservations/ReservationShow';
import WithdrawalIndex from './pages/Withdrawals/WithdrawalIndex';
import WithdrawalCreate from './pages/Withdrawals/WithdrawalCreate';
import ReviewIndex from './pages/Reviews/ReviewIndex';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

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

      if (!response.ok) {
        window.location.href = `${BASE_URL}/login`;
      } else {
        const data = await response.json();

        if(data != true) {
          window.location.href = `${BASE_URL}/login`;
        }
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    const validateAuth = async () => {
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
    };

    validateAuth();
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

const PageRoutes = () => (
  <Routes>

    <Route
      index
      element={
        <>
          <PageTitle title="Dashboard" />
          <DashboardIndex />
        </>
      }
    />

    {/* Spots */}
    <Route
      path="/spots"
      element={
        <>
          <PageTitle title="Parking Spots" />
          <SpotIndex />
        </>
      }
    />
    <Route
      path="/spots/create"
      element={
        <>
          <PageTitle title="Add Parking Spot" />
          <SpotCreate />
        </>
      }
    />
    <Route
      path="/spots/:id"
      element={
        <>
          <PageTitle title="Parking Spot Details" />
          <SpotShow />
        </>
      }
    />
    <Route
      path="/spots/:id/edit"
      element={
        <>
          <PageTitle title="Edit Parking Spot" />
          <SpotEdit />
        </>
      }
    />

    {/* Schedules */}
    <Route
      path="/schedules"
      element={
        <>
          <PageTitle title="Schedules" />
          <ScheduleIndex />
        </>
      }
    />
    <Route
      path="/schedules/create"
      element={
        <>
          <PageTitle title="Add Schedule" />
          <ScheduleCreate />
        </>
      }
    />
    <Route
      path="/schedules/:id"
      element={
        <>
          <PageTitle title="Schedule Details" />
          <ScheduleShow />
        </>
      }
    />
    <Route
      path="/schedules/:id/edit"
      element={
        <>
          <PageTitle title="Edit Schedule" />
          <ScheduleEdit />
        </>
      }
    />

    {/* Withdrawals */}
    <Route
      path="/withdrawals"
      element={
        <>
          <PageTitle title="Withdrawals" />
          <WithdrawalIndex />
        </>
      }
    />
    <Route
      path="/withdrawals/create"
      element={
        <>
          <PageTitle title="Withdraw Funds" />
          <WithdrawalCreate />
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

    {/* Reviews */}
    <Route
      path="/reviews"
      element={
        <>
          <PageTitle title="Reviews" />
          <ReviewIndex />
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
