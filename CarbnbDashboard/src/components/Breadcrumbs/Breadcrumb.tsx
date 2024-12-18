import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const location = useLocation();
  const isInSpots = location.pathname.startsWith('/spots') && location.pathname !== '/spots';
  const isInSchedules = location.pathname.startsWith('/schedules') && location.pathname !== '/schedules';
  const isInReservations = location.pathname.startsWith('/reservations') && location.pathname !== '/reservations';
  const isInWithdrawals = location.pathname.startsWith('/withdrawals') && location.pathname !== '/withdrawals';
  const isInReviews = location.pathname.startsWith('/reviews') && location.pathname !== '/reviews';
  const isDashboard = location.pathname === '/';

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {!isInSpots && !isInSchedules && !isInReservations && !isInWithdrawals && !isInReviews && !isDashboard &&(
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
          )}
          {isInSpots && (
            <li>
              <Link className="font-medium" to="/spots">
                Parking Spots /
              </Link>
            </li>
          )}
          {isInSchedules && (
            <li>
              <Link className="font-medium" to="/schedules">
                Schedules /
              </Link>
            </li>
          )}
          {isInReservations && (
            <li>
              <Link className="font-medium" to="/reservations">
                Reservations /
              </Link>
            </li>
          )}
          {isInWithdrawals && (
            <li>
              <Link className="font-medium" to="/withdrawals">
                Withdrawals /
              </Link>
            </li>
          )}
          {isInReviews && (
            <li>
              <Link className="font-medium" to="/reviews">
                Reviews /
              </Link>
            </li>
          )}
          {isDashboard && (
            <li>
              <Link className="font-medium" to="/">
                CarBNB /
              </Link>
            </li>
          )}
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
