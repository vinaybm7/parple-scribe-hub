import SecureAdminWrapper from '@/components/SecureAdminWrapper';
import AdminDashboard from './AdminDashboard';

const SecureAdminDashboard = () => {
  return (
    <SecureAdminWrapper>
      <AdminDashboard />
    </SecureAdminWrapper>
  );
};

export default SecureAdminDashboard;