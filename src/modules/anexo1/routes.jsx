import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import Sidebar from '../../shared/components/Sidebar';
import Anexo1MainPage from './components/pages/Anexo1MainPage';
import TramitePage from './components/pages/TramitePage';
import SeguimientoIntraPage from './components/pages/SeguimientoIntraPage';
import SeguimientoAmbulatorioPage from './components/pages/SeguimientoAmbulatorioPage';
import Anexo1Wrapper from './components/Anexo1Wrapper';

export const getAnexo1Routes = (isLogged, loading) => [
  <Route key="anexo1-general" path="general" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Anexo1Wrapper><Sidebar componente={Anexo1MainPage} /></Anexo1Wrapper>
    </RequireAuth>
  } />,
  <Route key="anexo1-tramite" path="tramite" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Anexo1Wrapper><Sidebar componente={TramitePage} /></Anexo1Wrapper>
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-intra" path="seguimiento-intra" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Anexo1Wrapper><Sidebar componente={SeguimientoIntraPage} /></Anexo1Wrapper>
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-ambulatorio" path="seguimiento-ambulatorio" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Anexo1Wrapper><Sidebar componente={SeguimientoAmbulatorioPage} /></Anexo1Wrapper>
    </RequireAuth>
  } />,
];
