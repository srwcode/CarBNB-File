import { useParams } from 'react-router-dom';
import TableScheduleShow from '../../components/Tables/TableScheduleShow';

const ScheduleShow = () => {
  const { id } = useParams();

  return (
    <>
      <TableScheduleShow showId={id} />
    </>
  );
};

export default ScheduleShow;