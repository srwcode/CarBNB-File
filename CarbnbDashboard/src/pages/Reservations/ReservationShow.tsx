import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableReservationShow from '../../components/Tables/TableReservationShow';

const ReservationShow = () => {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb pageName="Reservation Details" />

      <TableReservationShow showId={id} />
    </>
  );
};

export default ReservationShow;