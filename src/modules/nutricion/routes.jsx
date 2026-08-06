import { Route } from "react-router-dom";
import RequireAuth from "../../components/config/RequireAuth";
import Sidebar from "../../shared/components/Sidebar";
import Tamizaje from "./components/tamizaje/Tamizaje";
import ProtectedWithIdle from "../../components/config/ProtectedWithIdle";

export const getNutricionRoutes = (isLogged, loading) => [
    <Route key='nutricion-tamizaje' path='tamizaje' element={
        <RequireAuth isLogged={isLogged} loading={loading}>
            <ProtectedWithIdle>
                <Sidebar componente={Tamizaje} />
            </ProtectedWithIdle>
        </RequireAuth>
    } />
];