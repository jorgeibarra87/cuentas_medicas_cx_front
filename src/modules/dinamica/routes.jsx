import React from 'react'
import { Route } from 'react-router-dom'
import RequireAuth from '../../components/config/RequireAuth'
import ProtectedWithIdle from '../../components/config/ProtectedWithIdle'
import Sidebar from '../../shared/components/Sidebar'
import UpdateInnProduc from './components/innProduc/UpdateInnProduc'

export function getDinamicaRoutes(isLogged, loading) {
    return (
        <>
            <Route path='innProduc/update' element={<RequireAuth isLogged={isLogged} loading={loading}>
                <ProtectedWithIdle>
                    <Sidebar componente={UpdateInnProduc} />
                </ProtectedWithIdle>
            </RequireAuth>} />
        </>
    )
}

export default getDinamicaRoutes
