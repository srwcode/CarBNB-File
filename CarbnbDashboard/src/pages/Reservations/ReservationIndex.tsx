import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableReservationIndex from '../../components/Tables/TableReservationIndex';

const ReservationIndex = () => {
  return (
    <>
      <Breadcrumb pageName="Reservations" />
      
      <TableReservationIndex />
    </>
  );
};

export default ReservationIndex;
