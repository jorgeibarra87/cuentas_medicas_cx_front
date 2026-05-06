import { useEffect, useState, useMemo } from 'react';
import imgLogo from '../../img/favicon.ico';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { appMenu } from '../menu';
import { filtrarMenu } from '../menu/filterMenu';

export default function Sidebar({ componente: Componente }) {

  const stateSidebar = useSelector(state => state.sidebar);
  const statelogin = useSelector(state => state.login);
  const usuario = statelogin.decodeToken;

  const [submenuAbierto, setSubmenuAbierto] = useState(null);
  const location = useLocation();

  const toggleSubmenu = (nombre) => {
    setSubmenuAbierto(prev => prev === nombre ? null : nombre);
  };

  const isActive = (ruta) => location.pathname.startsWith(ruta);

  // Memo para evitar recalcular en cada render
  const opcionesFiltradas = useMemo(() => {
    return filtrarMenu(appMenu, usuario?.authorities);
  }, [usuario]);

  // Auto-expandir menú según la ruta actual
  useEffect(() => {
    const match = opcionesFiltradas.find(op =>
      op.submenu?.some(sub =>
        location.pathname.startsWith(sub.ruta)
      )
    );

    if (match) {
      setSubmenuAbierto(match.nombre);
    }
  }, [location.pathname, opcionesFiltradas]);

  return (
    <div className="wrapper">
      <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''} small`}>
        <div className="sidebar-header text-center">
          <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} />
          <Link to='/' className="sin-estilo">Soluciones HUSJP</Link>
        </div>
        <ul className="list-unstyled components">
          {opcionesFiltradas.map((opcion) => (
            <li key={opcion.nombre}>
              <button className="dropdown-toggle w-full text-left px-3 py-2 text-white hover:bg-gray-200" onClick={() => toggleSubmenu(opcion.nombre)} >
                {opcion.nombre}
              </button>
              {submenuAbierto === opcion.nombre && (
                <ul className="list-unstyled pl-4">
                  {opcion.submenu?.map((subopcion) => (
                    <li key={subopcion.nombre}>
                      {subopcion.submenuAdicional ? (
                        <details className="pl-2">
                          <summary className="cursor-pointer">{subopcion.nombre}</summary>
                          <ul className="pl-4">
                            {subopcion.submenuAdicional?.map((submenuadicional) => (
                              <li key={submenuadicional.nombre}>
                                <Link to={submenuadicional.ruta} className={`block px-2 py-1 ${isActive(submenuadicional.ruta)? 'bg-gray-300 font-semibold': 'hover:bg-gray-300'}`}>
                                  {submenuadicional.nombre}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link to={subopcion.ruta} className={`block px-2 py-1 ${ isActive(subopcion.ruta) ? 'bg-gray-300 font-semibold': 'hover:bg-gray-300'}`}>
                          {subopcion.nombre}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div id="content" className="flex flex-col h-screen">
        <div className="navbar-fixed">
          <Navbar />
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {Componente && <Componente />}
        </div>
        <footer className="footer-dinamico flex-shrink-0">
          <p className="text-muted text-center">
            <small>
              Soluciones HUSJP © {import.meta.env.VITE_APP_VERSION} Hospital Universitario San Jose. Ing. Julio Alvarez. Todos los derechos reservados. EXT. 134
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
}