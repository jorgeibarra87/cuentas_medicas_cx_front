import { Route } from "react-router-dom";
import ProtectedWithIdle from "../../components/config/ProtectedWithIdle";
import Sidebar from "../../shared/components/Sidebar";
import GenSerRipsCambioSipEstado from "./GenSerRipsCambioSipEstado";
import RequireAuth from "../../components/config/RequireAuth";

export function getFacturacionRoutes(isLogged, loading) {
    return (
        <>
            <Route path='cambioestadoips' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar componente={GenSerRipsCambioSipEstado} />
                </ProtectedWithIdle>
            </RequireAuth>} />
        </>
    )
};