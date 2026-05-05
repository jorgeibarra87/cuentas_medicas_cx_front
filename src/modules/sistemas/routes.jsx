// generamos las rutas para el modulo de sistemas

import { Route } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import ProtectedWithIdle from '../../components/config/ProtectedWithIdle';
import FormManteEquipos from './components/FormManteEquipos';
import RequireAuth from '../../components/config/RequireAuth';
import AjustesSistemas from './components/AjustesSistemas';

export function getSistemasRoutes(isLogged, loading) {
    return (
        <>
            <Route path='mantenimientochequeo' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar componente={FormManteEquipos} />
                </ProtectedWithIdle>
            </RequireAuth>} />
            <Route path='ajustes' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar componente={AjustesSistemas} />
                </ProtectedWithIdle>
            </RequireAuth>} />
        </>
    )
}