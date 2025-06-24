import { useEffect, useState } from 'react';
import imgLogo from '../../img/favicon.ico'
import Navbar from './Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cerrarSesionAction } from '../../actions/loginActions';
import { jwtDecode } from 'jwt-decode';
// import PropTypes from 'prop-types';
export default function Sidebar({ componente: Componente }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInactivity = () => {
        Swal.fire({
            title: 'Inactividad detectada',
            text: 'Por seguridad se cerrara la sesión',
            icon: 'warning',
            confirmButtonText: 'ENTIENDO'
        }).then(() =>{
            dispatch(cerrarSesionAction());
            navigate("/login");
        });
    };

    // Configurar inactividad en 10 minutos 10 * 60 * 1000
    //useInactivity(10 * 60 * 1000, handleInactivity);

    const stateSidebar = useSelector(state => state.sidebar);
    const statelogin = useSelector(state => state.login);
    const [usuario, setUsuario] = useState(statelogin.decodeToken);

    
    useEffect(() => {
        const token = localStorage.getItem('tokendos');
        const usuario2 = jwtDecode(token);
        const combinedAuthorities = usuario.authorities.concat(usuario2.authorities); 
                
        setUsuario({
            ...usuario,
            authorities: combinedAuthorities
        })
    }, [])

    const opcionesMenu = [
        {
            nombre: 'InnoProduc',
            roles: ['ROLE_ADMIN'], // Define los roles para esta opción
            submenu: [
                { nombre: 'Actualizar', ruta: '/innProduc/update', roles: ['ROLE_ADMIN', 'ROLE_INNPRODUC'] }, // Roles permitidos para esta subopción
            ]
        },
        {
            nombre: 'Sistemas',
            roles: ['ROLE_ADMIN','ROLE_SISTEMAS_MANTENIMIENTO'],
            submenu: [
                {
                    nombre: 'Mantenimiento chequeo', ruta: '/sistemas/mantenimientochequeo', roles: ['ROLE_ADMIN', 'ROLE_SISTEMAS_MANTENIMIENTO'],
                    // submenuAdicional: [
                    //     { nombre: 'Mantenimiento preventivo chequeo', ruta: '/humanizacion/solicitudes', roles: ['ROLE_ADMIN'] },
                    //     { nombre: 'solicitudes almacen', ruta: 'almacen', roles: ['ROLE_ADMIN'] }
                    // ]
                },
                {
                    nombre: 'Ajustes', ruta: '/sistemas/ajustes', roles: ['ROLE_ADMIN'],
                }
            ]
        },
        {
            nombre: 'Asignación_de_camas',
            roles: ['ROLE_ADMIN','ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_MEDICO_ESPECIALISTA','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_FACTURACION','ROLE_CAMAS_ENFERMERO_URGENCIAS'],
            submenu: [
                {nombre: 'Solicitar cama', ruta: '/asginacioncamas/solicitud', roles: ['ROLE_ADMIN','ROLE_ADMIN','ROLE_CAMAS_MEDICO_ESPECIALISTA','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_FACTURACION','ROLE_CAMAS_ENFERMERO_URGENCIAS']},
                {nombre: 'Asignaciones', ruta: '/asginacioncamas/', roles: ['ROLE_ADMIN','ROLE_ADMIN','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_ENFERMERO_URGENCIAS']}
            ]
        },
        {
            nombre: 'MesadeProcesos',
            roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER'],
            submenu: [
                {nombre: 'Procesos y subprocesos', ruta: '/mesaprocesos/procesosysubprocesos', roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD']},
                {nombre: 'Usuarios procesos', ruta: '/mesaprocesos/usuarioprocesos', roles: ['ROLE_ADMIN','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER']}
            ]
        },
        {
            nombre: 'Nutricion',
            roles: ['ROLE_ADMIN','ROLE_TAMIZAJE'],
            submenu:[
                {nombre: 'Tamizaje', ruta: '/nutricion/tamizaje', roles: ['ROLE_ADMIN','ROLE_TAMIZAJE']}
            ]
        },
        {
            nombre: 'MonitorizacionHc',
            roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_ADMIN'],
            submenu:[
                {nombre: 'Monitorizacion', ruta: '/monitorizacionhc/preguntas', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_ADMIN']},
                {nombre: 'Reportes', ruta: '/monitorizacionhc/reportes', roles: ['ROLE_ADMINISTRADOR']},
                {nombre: 'Ajustes', ruta: '/monitorizacionhc/ajustes', roles: ['ROLE_ADMINISTRADOR']}
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
                <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''} small`} >
                    <div className="sidebar-header  align-items-center text-center">
                        <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} className="mr-2" />
                        <Link to='/' className="mb-0 mx-1 sin-estilo "> Soluciones HUSJP</Link>
                    </div>
                    <ul className="list-unstyled components">
                        {opcionesFiltradas.map((opcion, index) => (
                            <li key={index}>
                                <a href={`#${opcion.nombre}Submenu`} data-bs-toggle="collapse" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">{opcion.nombre}</a>
                                <ul className="collapse list-unstyled" id={`${opcion.nombre}Submenu`} data-bs-parent="#sidebar ul.components">
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
                    <div className="navbar-fixed">
                       <Navbar />
                    </div>
                    <div className="content-scroll">
                        {Componente && <Componente />}
                        <footer className="footer-dinamico">
                            <p className="text-muted text-center">
                                <small>Soluciones HUSJP © 2024 Hospital Universitario San Jose. Ing. Julio Alvarez. Todos los derechos reservados. EXT. 134</small>
                            </p>
                        </footer>
                    </div>
                </div> 
            </div>
            
        </div>
    )
}

//agregamos para que se valinden errores de prop.types
// Sidebar.propTypes = {
//     componente: PropTypes.elementType.isRequired,
// }