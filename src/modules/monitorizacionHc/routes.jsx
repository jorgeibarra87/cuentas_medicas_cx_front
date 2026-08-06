import React from 'react'
import { Route } from 'react-router-dom'
import RequireAuth from '../../components/config/RequireAuth'
import ProtectedWithIdle from '../../components/config/ProtectedWithIdle'
import Sidebar from '../../shared/components/Sidebar'
import FormPreguntas from './components/FormPreguntas'
import AjustesMhc from './components/AjustesMhc'
import ReportesIndex from './components/ReportesIndex'

export function getMonitorizacionHcRoutes(isLogged, loading) {
    return (
        <>
            <Route path='preguntas/:tipo' element={
                <RequireAuth isLogged={isLogged} loading={loading} >
                    <ProtectedWithIdle>
                        <Sidebar componente={FormPreguntas} />
                    </ProtectedWithIdle>
                </RequireAuth>}
            />
            <Route path='reportes' element={
                <RequireAuth isLogged={isLogged} loading={loading}>
                    <ProtectedWithIdle>
                        <Sidebar componente={ReportesIndex} />
                    </ProtectedWithIdle>
                </RequireAuth>} />

            <Route path='ajustes' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar componente={AjustesMhc} />
                </ProtectedWithIdle>
            </RequireAuth>} />
        </>
    )
}

export default getMonitorizacionHcRoutes
