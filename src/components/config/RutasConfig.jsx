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
import { obtenerToken } from '../../actions/loginActions';

export default function RutasConfig() {
    
    const state = useSelector(state => state.login);
    const [isLogged, setIsLogged] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(obtenerToken());
    },[dispatch]);
    
    useEffect(() => {
        if(state.token !== null){
            setIsLogged(true);
        }
        else{
            setIsLogged(false);
        }
    }, [state])

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<RequireAuth isLogged={isLogged}> <Sidebar /></RequireAuth>} />
                <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />
                <Route path='/innProduc'  >
                    <Route path='' element={<RequireAuth isLogged={isLogged}> <Sidebar /></RequireAuth>} />
                    <Route path='update' element={<RequireAuth isLogged={isLogged}> <Sidebar componente={UpdateInnProduc}/></RequireAuth>} />
                    <Route path='*' element={<Error404 />} />
                </Route>
                <Route path='/mesaprocesos'>
                    <Route path='usuarioprocesos' element={<RequireAuth isLogged={isLogged}><Sidebar componente={UsuariosProceso}/></RequireAuth>} />
                    <Route path='procesosysubprocesos' element={<RequireAuth isLogged={isLogged}><Sidebar componente={ProcesosSubprocesos}/></RequireAuth>}/>
                </Route>
                <Route path='/password'>
                    <Route path='documento' element={<FormSolDocumento />}/>
                </Route>
                <Route path='/humanizacion'>
                    <Route path='solicitudes'element={<RequireAuth isLogged={isLogged}><Sidebar componente={HumanizacionSolicitudes}/></RequireAuth>}/>
                </Route>
                <Route path='/ajustes'>
                    <Route path='usuario' element={<RequireAuth isLogged={isLogged}><Sidebar componente={OpcionesUsuario}/></RequireAuth>}></Route>
                </Route>
                <Route path='*' element={<Error404 />} />
            </Routes>
        </HashRouter>
    )
}
