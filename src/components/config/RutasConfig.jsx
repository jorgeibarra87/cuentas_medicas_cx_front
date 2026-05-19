import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerToken } from '../../actions/loginActions';
import FormSolDocumento from '../forgetpass/FormSolDocumento';
import { getDinamicaRoutes } from '../../modules/dinamica';
import { getAppRoutes } from '../../shared';
import { getMonitorizacionHcRoutes } from '../../modules/monitorizacionHc';
import { getRehabilitacionRoutes } from '../../modules/rehabilitacion';
import { getReferenciacontrarreferenciaRoutes } from '../../modules/referencia-contrareferencia';
import { getNutricionRoutes } from '../../modules/nutricion';
import { getSistemasRoutes } from '../../modules/sistemas';
import { getFacturacionRoutes } from '../../modules/facturacion';

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
