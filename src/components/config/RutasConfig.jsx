import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import Error404 from '../Error404'
import { useEffect, useState } from 'react';
import RequireAuth from './RequireAuth';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../nav/Sidebar';
import UpdateInnProduc from '../innProduc/UpdateInnProduc';
import FormSolDocumento from '../forgetpass/FormSolDocumento';
import HumanizacionSolicitudes from '../humanizacion/HumanizacionSolicitudes';
import OpcionesUsuario from '../ajustes/OpcionesUsuario';
import UsuariosProceso from '../mesaDeProcesos/UsuariosProceso';
import ProcesosSubprocesos from '../mesaDeProcesos/ProcesosSubprocesos';
import SolicitudCama from '../solAsigCamas/SolicitudCama';
import AsignacionCama from '../solAsigCamas/AsignacionCama';
import { cerrarSesionAction, obtenerToken } from '../../actions/loginActions';
import Tamizaje from '../tamizaje/Tamizaje';
import FormPreguntas from '../monitorizacionHc/FormPreguntas';

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
        if(state.token !== null){
            const currentTime = Math.floor(Date.now() / 1000);
            if (state.decodeToken.exp < currentTime){
                dispatch(cerrarSesionAction());
            }
            setIsLogged(true);
        }
        else{
            setIsLogged(false);
        }
    }, [state])

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<RequireAuth isLogged={isLogged} loading={loading}> <Sidebar /></RequireAuth>} />
                <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />
                <Route path='/innProduc'  >
                    <Route path='' element={<RequireAuth isLogged={isLogged} loading={loading}> <Sidebar /></RequireAuth>} />
                    <Route path='update' element={<RequireAuth isLogged={isLogged} loading={loading}> <Sidebar componente={UpdateInnProduc}/></RequireAuth>} />
                    <Route path='*' element={<Error404 />} />
                </Route>
                <Route path='/asginacioncamas'>
                    <Route path='solicitud' element={<RequireAuth isLogged={isLogged} loading={loading}> <Sidebar componente={SolicitudCama}/></RequireAuth>}/>
                    <Route path='' element={<RequireAuth isLogged={isLogged} loading={loading}> <Sidebar componente={AsignacionCama} /></RequireAuth>} />
                </Route>
                <Route path='/mesaprocesos'>
                    <Route path='usuarioprocesos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={UsuariosProceso}/></RequireAuth>} />
                    <Route path='procesosysubprocesos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={ProcesosSubprocesos}/></RequireAuth>}/>
                </Route>
                <Route path='/nutricion'>
                    <Route path='tamizaje' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={Tamizaje}/></RequireAuth>} />
                </Route>
                <Route path='/password'>
                    <Route path='documento' element={<FormSolDocumento />}/>
                </Route>
                <Route path='/humanizacion'>
                    <Route path='solicitudes' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={HumanizacionSolicitudes}/></RequireAuth>}/>
                </Route>
                <Route path='/monitorizacionhc'>
                    <Route path='preguntas' element={<RequireAuth isLogged={isLogged} loading={loading} ><Sidebar componente={FormPreguntas}/></RequireAuth>} />
                </Route>
                <Route path='/ajustes'>
                    <Route path='usuario' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={OpcionesUsuario}/></RequireAuth>}></Route>
                </Route>
                <Route path='*' element={<Error404 />} />
            </Routes>
        </HashRouter>
    )
}
