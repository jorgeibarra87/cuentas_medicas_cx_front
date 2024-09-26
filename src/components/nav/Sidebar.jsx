import { useState } from 'react';
import imgLogo from '../../img/favicon.ico'
import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
export default function Sidebar({ componente: Componente }) {

    const stateSidebar = useSelector(state => state.sidebar);
    const statelogin = useSelector(state => state.login);
    const [usuario] = useState(statelogin.decodeToken);

    const opcionesMenu = [
        {
            nombre: 'InnoProduc',
            roles: ['ROLE_ADMIN'], // Define los roles para esta opción
            submenu: [
                { nombre: 'Actualizar', ruta: '/innProduc/update', roles: ['ROLE_ADMIN', 'ROLE_INNPRODUC'] }, // Roles permitidos para esta subopción
            ]
        },
        // {
        //     nombre: 'Humanización',
        //     roles: ['ROLE_ADMIN'],
        //     submenu: [
        //         {
        //             nombre: 'Identificación de necesidades', ruta: '/a', roles: ['ROLE_ADMIN'],
        //             submenuAdicional: [
        //                 { nombre: 'solicitudes', ruta: '/humanizacion/solicitudes', roles: ['ROLE_ADMIN'] },
        //                 { nombre: 'solicitudes almacen', ruta: 'almacen', roles: ['ROLE_ADMIN'] }
        //             ]
        //         },
        //         // { nombre: 'Opcion B', ruta: '/b', roles: ['ROLE_ADMIN'] }
        //     ]
        // },
        {
            nombre: 'MesadeProcesos',
            roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER'],
            submenu: [
                {nombre: 'Procesos y subprocesos', ruta: '/mesaprocesos/procesosysubprocesos', roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD']},
                {nombre: 'Usuarios procesos', ruta: '/mesaprocesos/usuarioprocesos', roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER']}
            ]
        },
        {
            nombre: 'Ajustes',
            roles: ['ROLE_ADMIN'],
            submenu: [
                { nombre: 'Usuario', ruta: '/ajustes/usuario', roles: ['ROLE_ADMIN']}
            ]
        }
        // Agrega más opciones de menú aquí si es necesario
    ];

    // Filtra las opciones del menú principal según los roles del usuario
    const opcionesFiltradas = opcionesMenu.filter(opcion => {
        if (!opcion.roles) return true; // Si no se especifican roles, mostrar la opción
        return opcion.roles.some(rol => usuario.authorities.includes(rol));
    });

    // Filtra las subopciones del menú según los roles del usuario
    const filtrarSubopciones = (subopciones) => {
        return subopciones.filter(subopcion => {
            if (!subopcion.roles) return true; // Si no se especifican roles, mostrar la subopción
            return subopcion.roles.some(rol => usuario.authorities.includes(rol));
        });
    };

    const filtrarSubmenuAdicional = (subopcionesadicionales) => {
        return subopcionesadicionales.filter(subopcionadicional => {
            if (!subopcionadicional.roles) return true;
            return subopcionadicional.roles.some(rol => usuario.authorities.includes(rol));
        });
    };

    return (
        <div >
            <div className="wrapper">
                <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''}`} >
                    <div className="sidebar-header d-inline-flex align-items-center">
                        <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} className="mr-2" />
                        <Link to='/' className="mb-0 mx-1 sin-estilo "> Soluciones HUSJP</Link>
                    </div>
                    <ul className="list-unstyled components">
                        {opcionesFiltradas.map((opcion, index) => (
                            <li key={index}>
                                <a href={`#${opcion.nombre}Submenu`} data-bs-toggle="collapse" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">{opcion.nombre}</a>
                                <ul className="collapse list-unstyled" id={`${opcion.nombre}Submenu`}>
                                    {filtrarSubopciones(opcion.submenu).map((subopcion, subindex) => (
                                        <li key={subindex} className=' nav-item dropdown'>
                                            <div className="dropend" >
                                                {subopcion.submenuAdicional ? (
                                                    <>
                                                        <Link to={subopcion.ruta} className='dropdown-toggle' data-bs-toggle="dropdown" >{subopcion.nombre}</Link>
                                                        <ul className="dropdown-menu">
                                                            {filtrarSubmenuAdicional(subopcion.submenuAdicional).map((submenuadicional, subadcionalindex) => (
                                                                <li key={subadcionalindex} className='specialmenu'>
                                                                    <Link to={submenuadicional.ruta} className='negrito'>{submenuadicional.nombre}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                ) : (
                                                    <Link to={subopcion.ruta}>{subopcion.nombre}</Link>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div id="content">
                    <Navbar />
                    {Componente && <Componente />}
                    

                    {/* <footer className="footer small">
                        <hr />
                        <p className="text-muted text-center">Soluciones HUSJP © 2024 Hospital Universitario San Jose. Todos los derechos reservados. EXT. 134</p>
                    </footer> */}
                </div>
                

            </div>
            <div className='position-relative'>
                <div className='position-absolute bottom-0 start-50 translate-middle-x'>
                    <footer>
                        <p className="text-muted text-center">Soluciones HUSJP © 2024 Hospital Universitario San Jose. Todos los derechos reservados. EXT. 134</p>
                    </footer>
                </div>
            </div>
        </div>
    )
}

//agregamos para que se valinden errores de prop.types
// Sidebar.propTypes = {
//     componente: PropTypes.elementType.isRequired,
// }