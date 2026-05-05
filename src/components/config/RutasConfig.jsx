import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppRoutes } from '../../shared/routes';
import { getDinamicaRoutes } from '../../modules/dinamica/routes';
import FormSolDocumento from '../forgetpass/FormSolDocumento';
import HumanizacionSolicitudes from '../humanizacion/HumanizacionSolicitudes';
import { obtenerToken } from '../../actions/loginActions';
import Tamizaje from '../../modules/nutricion/components/tamizaje/Tamizaje';

import FormManteEquipos from '../../modules/sistemas/components/FormManteEquipos';
import AjustesSistemas from '../../modules/sistemas/components/AjustesSistemas';
import { getMonitorizacionHcRoutes } from '../../modules/monitorizacionHc/routes';
import GenSerRipsCambioSipEstado from '../../modules/facturacion/GenSerRipsCambioSipEstado';
import { getRehabilitacionRoutes } from '../../modules/rehabilitacion/routes';
import { getReferenciacontrarreferenciaRoutes } from '../../modules/referencia-contrareferencia/routes';
import { getNutricionRoutes } from '../../modules/nutricion/routes';
import { getSistemasRoutes } from '../../modules/sistemas/routes';
import { getFacturacionRoutes } from '../../modules/facturacion/routes';

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
                <Route path='/rehabilitacion'> {getRehabilitacionRoutes(isLogged, loading)}</Route>
                <Route path='/nutricion'>{getNutricionRoutes(isLogged, loading)} </Route>
                <Route path='/monitorizacionhc'> {getMonitorizacionHcRoutes(isLogged, loading)} </Route>
                <Route path="/sistemas">{getSistemasRoutes(isLogged, loading)}</Route>
                <Route path='/facturacion'>{getFacturacionRoutes(isLogged, loading)}</Route>
                <Route path='/password'>
                    <Route path='documento' element={<FormSolDocumento />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}
