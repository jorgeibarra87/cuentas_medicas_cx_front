import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import Login from '../modules/auth/components/Login'
import RequireAuth from '../components/config/RequireAuth'
import ProtectedWithIdle from '../components/config/ProtectedWithIdle'
import Sidebar from './components/Sidebar'
import OpcionesUsuario from '../modules/ajustes/OpcionesUsuario'
import Error404 from './components/Error404'

export function getAppRoutes(isLogged, loading) {
    return (
        <>
            <Route path='/' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar />
                </ProtectedWithIdle>
            </RequireAuth>} />
            <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />
            <Route path='/ajustes'>
                <Route path='usuario' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={OpcionesUsuario} /></RequireAuth>} />
            </Route>
            <Route path='*' element={<Error404 />} />
        </>
    )
}

export default getAppRoutes
