import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableReviewShow from '../../components/Tables/TableReviewShow';

const ReviewShow = () => {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb pageName="Review Details" />

      <TableReviewShow showId={id} />
    </>
  );
};

export default ReviewShow;