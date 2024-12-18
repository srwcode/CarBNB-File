import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableScheduleShow from '../../components/Tables/TableScheduleShow';

const ScheduleShow = () => {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb pageName="Schedule Details" />

      <TableScheduleShow showId={id} />
    </>
  );
};

export default ScheduleShow;