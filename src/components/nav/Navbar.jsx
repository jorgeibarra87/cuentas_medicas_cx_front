import { useDispatch, useSelector } from "react-redux"
import { mostrarBarraLateral, ocultarBarraLateral } from "../../actions/sidebarActions";
import { cerrarSesionAction } from "../../actions/loginActions";
import { useState } from "react";

export default function Navbar() {

    const stateSidebar = useSelector(state => state.sidebar);
    const statelogin = useSelector(state => state.login);
//    const [usuario] = useState(statelogin.decodeToken);
    const [username] = useState(statelogin.username);
    const dispatch = useDispatch();

    const handleSidebar = () => {
        if (stateSidebar.state == false) {
            dispatch(ocultarBarraLateral());
        } else {
            dispatch(mostrarBarraLateral());
        }
    }

    const handleLogout = () => {
        dispatch(cerrarSesionAction());
        window.location.href = "/";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
            <div className="container-fluid">
                <button type="button" id="sidebarCollapse" onClick={handleSidebar} className="btn">
                    <i className="bi bi-distribute-vertical"></i>
                </button>
                <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-align-justify"></i>
                </button>
                <ul className="nav navbar-nav ml-auto justify-content-end">
                    <li className="nav-item">
                        <a className="nav-link">Usuario: {username}</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={handleLogout}>Salir</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
