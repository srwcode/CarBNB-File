import { useParams } from 'react-router-dom';
import TableReservationShow from '../../components/Tables/TableReservationShow';

const ReservationShow = () => {
  const { id } = useParams();

  return (
    <>
      <TableReservationShow showId={id} />
    </>
  );
};

export default ReservationShow;