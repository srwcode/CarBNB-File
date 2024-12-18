import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableSpotShow from '../../components/Tables/TableSpotShow';

const SpotShow = () => {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb pageName="Parking Spot Details" />

      <TableSpotShow showId={id} />
    </>
  );
};

export default SpotShow;