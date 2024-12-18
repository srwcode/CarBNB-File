import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableWithdrawalIndex from '../../components/Tables/TableWithdrawalIndex';

const WithdrawalIndex = () => {
  return (
    <>
      <Breadcrumb pageName="Withdrawals" />
      
      <TableWithdrawalIndex />
    </>
  );
};

export default WithdrawalIndex;
