import { useDispatch, useSelector } from "react-redux"
import { mostrarBarraLateral, ocultarBarraLateral } from "../../actions/sidebarActions";
import { cerrarSesionAction } from "../../actions/loginActions";
import { useState } from "react";
import axios from "axios";
import { RUTA_BACK_PRODUCCION } from "../../types";

export default function Navbar() {

    const stateSidebar = useSelector(state => state.sidebar);
    const statelogin = useSelector(state => state.login);
    const [usuario] = useState(statelogin.decodeToken);
    const dispatch = useDispatch();
    const token = statelogin.token;

    const axiosInstance = axios.create({
        baseURL: `${RUTA_BACK_PRODUCCION}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const handleSidebar = () => {
        if (stateSidebar.state == false) {
            dispatch(ocultarBarraLateral());
        } else {
            dispatch(mostrarBarraLateral());
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('tokenhusjp');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <button type="button" onClick={handleSidebar} className="btn navbar-toggle-sidebar-btn">
                        <i className="bi bi-distribute-vertical"></i>
                    </button>
                </div>
                <div className="d-flex align-items-center">
                    <ul className="nav navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link">Usuario: {usuario.name_user}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={handleLogout}>Salir</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
