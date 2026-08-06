import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import Sidebar from '../../shared/components/Sidebar';
import CirugiasPage from './components/pages/CirugiasPage';
import ReportesCirugias from './components/pages/ReportesCirugias';

export const getAuditoriaCuentasMedicasRoutes = (isLogged, loading) => [
    <Route key='auditoria-procedimientos' path='procedimientos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={CirugiasPage} /></RequireAuth>} />,
    <Route key='auditoria-reportes' path='reportes' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={ReportesCirugias} /></RequireAuth>} />
];
