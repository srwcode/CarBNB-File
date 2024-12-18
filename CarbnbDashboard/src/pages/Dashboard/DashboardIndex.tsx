import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableDashboardIndex from '../../components/Tables/TableDashboardIndex';

const DashboardIndex = () => {
  return (
    <>
      <Breadcrumb pageName="Dashboard" />
      
      <TableDashboardIndex />
    </>
  );
};

export default DashboardIndex;
