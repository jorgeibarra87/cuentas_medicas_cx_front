import { useEffect, useState, useMemo } from 'react';
import imgLogo from '../../img/favicon.ico';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { appMenu } from '../menu';
import { filtrarMenu } from '../menu/filterMenu';
import SidebarItem from './SidebarItem';

export default function Sidebar({ componente: Componente }) {

  const stateSidebar = useSelector(state => state.sidebar);
  const statelogin = useSelector(state => state.login);
  const usuario = statelogin.decodeToken;
  const [abierto, setAbierto] = useState(null);

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
          {opcionesFiltradas.map(item => (
            <SidebarItem key={item.nombre} item={item} isOpen={abierto === item.nombre} setOpen={() => setAbierto(abierto === item.nombre ? null : item.nombre)} />
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