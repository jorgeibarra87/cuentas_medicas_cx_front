import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerToken } from '../../actions/loginActions';
import FormSolDocumento from '../forgetpass/FormSolDocumento';
import RequireAuth from './RequireAuth';
import ProtectedWithIdle from './ProtectedWithIdle';
import Sidebar from '../../shared/components/Sidebar';
import { getDinamicaRoutes } from '../../modules/dinamica';
import { getAppRoutes } from '../../shared';
import { getMonitorizacionHcRoutes } from '../../modules/monitorizacionHc';
import { getAnexo1Routes } from '../../modules/anexo1/routes';
import { getRehabilitacionRoutes } from '../../modules/rehabilitacion';
import { getReferenciacontrarreferenciaRoutes } from '../../modules/referencia-contrareferencia';
import { getNutricionRoutes } from '../../modules/nutricion';
import { getSistemasRoutes } from '../../modules/sistemas';
import { getFacturacionRoutes } from '../../modules/facturacion';
import TrasladosAdminTable from '../../modules/referencia-contrareferencia/components/admin/TrasladosAdminTable';
import CuentasMedicasAdminTable from '../../modules/referencia-contrareferencia/components/admin/CuentasMedicasAdminTable';
import FacturacionesAdminTable from '../../modules/referencia-contrareferencia/components/admin/FacturacionesAdminTable';
import PacientesAdminTable from '../../modules/anexo1/components/admin/PacientesAdminTable';
import TramitesAdminTable from '../../modules/anexo1/components/admin/TramitesAdminTable';
import SeguimientoIntraAdminTable from '../../modules/anexo1/components/admin/SeguimientoIntraAdminTable';
import SeguimientoAmbAdminTable from '../../modules/anexo1/components/admin/SeguimientoAmbAdminTable';
import EgresosAdminTable from '../../modules/anexo1/components/admin/EgresosAdminTable';
import TipoSolicitudAdminTable from '../../modules/anexo1/components/admin/TipoSolicitudAdminTable';

export default function RutasConfig() {

    const state = useSelector(state => state.login);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        // Maneja la carga del token y actualiza el estado de carga
        setLoading(true);
        //dispatch({ type: 'OBTENER_TOKEN' }); // Acción síncrona
        dispatch(obtenerToken());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (state.token !== null) {
            setIsLogged(true);
        }
        else {
            setIsLogged(false);
        }
    }, [state])

    return (
        <HashRouter>
            <Routes>
                {getAppRoutes(isLogged, loading)}
                <Route path='/dinamica'> {getDinamicaRoutes(isLogged, loading)} </Route>
                <Route path='/referenciacontrareferencia'> {getReferenciacontrarreferenciaRoutes(isLogged, loading)} </Route>
                <Route path='/anexo1'> {getAnexo1Routes(isLogged, loading)} </Route>
                <Route path='/rehabilitacion'> {getRehabilitacionRoutes(isLogged, loading)}</Route>
                <Route path='/nutricion'>{getNutricionRoutes(isLogged, loading)} </Route>
                <Route path='/monitorizacionhc'> {getMonitorizacionHcRoutes(isLogged, loading)} </Route>
                <Route path="/sistemas">{getSistemasRoutes(isLogged, loading)}</Route>
                <Route path='/facturacion'>{getFacturacionRoutes(isLogged, loading)}</Route>
                <Route path='/admin/traslados' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={TrasladosAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/cuentas-medicas' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={CuentasMedicasAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/facturaciones' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={FacturacionesAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/pacientes' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={PacientesAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/tramites' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={TramitesAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/seguimiento-intra' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={SeguimientoIntraAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/seguimiento-ambulatorio' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={SeguimientoAmbAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/egresos' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={EgresosAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/admin/tipos-solicitud' element={<RequireAuth isLogged={isLogged} loading={loading}><ProtectedWithIdle><Sidebar componente={TipoSolicitudAdminTable} /></ProtectedWithIdle></RequireAuth>} />
                <Route path='/password'>
                    <Route path='documento' element={<FormSolDocumento />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}
