import { useEffect, useState } from 'react'
import { FormatearFecha } from '../../utilities/FormatearFecha';
import icono from '../../img/camillero.ico';
import spinnerLoginText from '../Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import InfoModal from './InfoModal';
import FormEditAsignCama from './FormEditAsignCama';
import { useSelector } from 'react-redux';
import { obtenerBloquesServicio } from '../../api/asignacionCamas/bloqueServicioService';
import { obtenerVersionSolicitudCamaByIdBloque } from '../../api/asignacionCamas/asignacionVersionSolCamaService';
import { cancelarAsignacionVersionSolicitudCama, finalizarAsignacionVersionSolicitudCama } from '../../api/asignacionCamas/asignacionSolicitudCama';

// const SOCKET_URL = 'http://localhost:8004/ws-notifications'; 
// const client = new Client(
//     { 
//         brokerURL: SOCKET_URL, 
//         webSocketFactory: () => new SockJS(SOCKET_URL), 
//         onConnect: () => { 
//             console.log('Connected'); 
//             client.subscribe('/topic/notifications', (message) => { 
//                     if (message.body) { 
                        
//                         showNotification(message.body);
//                     } 
//                 }); 
//             }, 
//             onStompError: (frame) => { 
//                 console.error(`Broker reported error: ${frame.headers['message']}`); 
//                 console.error(`Additional details: ${frame.body}`); 
//             } 
//         });

// const showNotification = (message) => { 
//     if (Notification.permission === 'granted') { 
//         console.log('Notificación-------', message);
//         const notification = new Notification('SOLICITUD CAMILLERO', 
//             { body: message, 
//                 icon: icono,
//             }); 

        // notification.onclick = (e) => { 
        //     e.preventDefault(); 
        //     window.open('http://localhost:3000/asginacioncamas/', '_blank'); 
        // };
        
//     } 
// };

// export const connect = () => {
//     try {
//         client.activate();
//     } catch (error) {
//         console.error(error);
//     }
// }; 
// export const disconnect = () => { 
//     client.deactivate(); 
// };

export default function AsignacionCama() {

    const statelogin = useSelector(state => state.login);

    const [authorities] = useState(statelogin.decodeToken.authorities);

    const [asignacionesCama, setAsignacionesCama] = useState([]);
    const [bloquesServicio, setBloquesServicio] = useState([]);
    const [bloqueServicioSeleccionado, setBloqueServicioSeleccionado] = useState(null);
    // const [permission, setPermission] = useState(Notification.permission);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModalFormEditAsignacion, setShowModalFormEditAsignacion] = useState(false);
    const [versionAsignacionSolicitudCama, setVersionAsignacionSolicitudCama] = useState(null);
    const [versionAsignacionSolicitudCamaEditar, setVersionAsignacionSolicitudCamaEditar] = useState(null);

    // const [notifications, setNotifications] = useState([]);

    
    // useEffect(() => {
    //     if(permission !== 'granted' && permission !== 'denied'){
    //         Notification.requestPermission().then((permission) => {
    //             setPermission(permission);
    //         });
    //     }
    //     connect(); return () => disconnect();

    // }, []);

    useEffect(() => {
        //cambiar icono 
        const link = document.querySelector("link[rel='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = icono; // Usa el path del icono importado
        document.head.appendChild(link);
        //cambia el titulo
        document.title = "Asignaciones de Cama";

        const obtenerBloques = async () => {
            const response = await obtenerBloquesServicio();
            setBloquesServicio(response);
        };
        if(bloquesServicio.length === 0) obtenerBloques();

    }, []);

    useEffect(() => {
        const getVersionesSolicitudCama = async () => {
            await obtenerVersionSolicitudCamaByIdBloque(bloqueServicioSeleccionado)
                .then(response => {
                    setAsignacionesCama(response);
                    // Swal.close();
                }).catch(error => {
                    console.error(error);
                });
        }
        if(bloqueServicioSeleccionado != null && bloqueServicioSeleccionado !== ""){
            spinnerLoginText("Cargando...");
            getVersionesSolicitudCama();
        }
    }, [bloqueServicioSeleccionado]);

    // useEffect(() => {
    //     const existingTooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    //     existingTooltips.forEach(toolTipEl => {
    //         const tooltipInstance = bootstrap.Tooltip.getInstance(toolTipEl);
    //         if(tooltipInstance){
    //             tooltipInstance.dispose();
    //         }
    //     });
    //     // inicializar nuevos tooltips
    //     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    //     tooltipTriggerList.forEach(tooltipTriggerEl => {
    //         new bootstrap.Tooltip(tooltipTriggerEl);
    //     });
    // } ,[asignacionesCama]);

    const handleBloqueServicio = (e) => {
        const {value} = e.target;
        setBloqueServicioSeleccionado(value);
    };

    const handleInfo = (item) => {
        setSelectedItem(item); // Almacena el ítem seleccionado
        setShowInfoModal(true); // Muestra el modal 
    }

    const handleFinalizar  = async (item) => {
        // Swal.fire({
        //     title: 'Finalizar Traslado',
        //     text: '¿Está seguro que el paciente llego a la cama de destino?',
        //     icon: 'question',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((result) => {
        //     if(result.isConfirmed){
        //         cancelarAsignacion();
        //     }
        //     function cancelarAsignacion() {
        //         finalizarAsignacionVersionSolicitudCama(item.asignacionCama.id)
        //             .then(() => {
        //                 Swal.fire({
        //                     title: 'Finalizado',
        //                     text: 'se finalizo exitosamente.',
        //                     icon: 'success',
        //                     timer: 1500,
        //                     timerProgressBar: true,
        //                     showConfirmButton: false
        //                 });
        //                 const asignaciones = asignacionesCama.filter(asignacion => asignacion.id !== item.id);
        //                 setAsignacionesCama(asignaciones);
        //             }
        //             ).catch(error => {
        //                 console.error(error);
        //             });
        //     }
        // });
    };

    const handleEditar = (item) => {
        setVersionAsignacionSolicitudCama(item);
        setShowModalFormEditAsignacion(true);

    };

    useEffect(() => {  
        if(versionAsignacionSolicitudCamaEditar != null){
            const versionAsignaciones = asignacionesCama.map(asignacion => {
                if(asignacion.asignacionCama.id === versionAsignacionSolicitudCamaEditar.asignacionCama.id){
                    return versionAsignacionSolicitudCamaEditar;
                }
                return asignacion;
            });
            setAsignacionesCama(versionAsignaciones);
        }
    },[versionAsignacionSolicitudCamaEditar]);

    const handleCancelar = async (item) => {
        // try{
        //     const { value: motivo} = await Swal.fire({
        //         title: 'Motivo de Cancelación',
        //         text: 'Por favor ingrese el motivo de la cancelación',
        //         input: 'text',
        //         showCancelButton: true,
        //         confirmButtonText: 'Aceptar',
        //         cancelButtonText: 'Cancelar',
        //         inputValidator: (value) => {
        //             if(!value){
        //                 return 'Por favor ingrese un motivo';
        //             }
        //         }
        //     });
        //     if(!motivo) return;
        //     await cancelarAsignacionVersionSolicitudCama(item.asignacionCama.id, item.id, motivo)
        //     .then(() => {
        //         const asignaciones = asignacionesCama.filter(asignacion => asignacion.id !== item.id);
        //         setAsignacionesCama(asignaciones);
        //     }).catch(error => {
        //         console.error(error);
        //     });
        // }catch(error){
        //     console.error(error);
        // }
    };

    return (
        <>
            <h4 className='text-center'>ESCOGE EL BLOQUE</h4>
            <div className='row align-items-start'>
                <div className="col-2 mx-2 py-2">
                        <select className="form-select form-select-sm" name='bloqueServicio' onChange={handleBloqueServicio}>
                            <option value="">Selecciona el bloque</option>
                            {bloquesServicio.map((item) => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                {/* <div className="col-2 mx-2 py-2">
                    <select className="form-select form-select-sm">
                        <option value="">Filtrar Por Servicio</option>
                        <option value="opcion1">Urgencias</option>
                        <option value="opcion2">Quirúrgicas</option>
                    </select>
                </div>
                <div className="col-2 py-2">
                    <select className="form-select form-select-sm">
                        <option value="">Filtrar por Especialidad</option>
                        <option value="opcion1">Opción 1</option>
                        <option value="opcion2">Opción 2</option>
                    </select>
                </div>
                <div className="col-2 py-2">
                    <input type="text" className="form-control form-control-sm" placeholder="Buscar..." />
                </div> */}
            </div>
            <div className="container-fluid">
                <div className="table-container">
                    <table className="table table-hover table-bordered table-sm table-small-text">
                        <thead className="table-primary">
                            <tr>
                                {[
                                    "Informacion Solicitud",
                                    "Id",
                                    "IdMod",
                                    "Servicio Origen",
                                    "Fecha_Respuesta",
                                    "Ingreso",
                                    "Documento",
                                    "Nombre",
                                    "Diagnostico",
                                    "Especialidad Tratante",
                                    "Aislamiento",
                                    "Estado",
                                    "Servicio Destino ",
                                    "Cama Destino",
                                    "Extension",
                                    "Enfermero Origen",
                                    "Enfermero Destino",
                                    "Observacion",
                                    "Responsable Asignacion",
                                    "Opciones"
                                ].map((header) => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    asignacionesCama.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button className="btn" onClick={() => handleInfo(item)}>
                                                    {/* <FontAwesomeIcon icon={faEye} /> */}
                                                </button>
                                            </td>
                                            <td>{item.asignacionCama.id}</td>
                                            <td>{item.id}</td>
                                            <td>{item.asignacionCama.solicitudCama.versionSolicitud.servicio.nombre}</td>
                                            <td>{FormatearFecha(item.fechaCreacion)}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.id}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.documento}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.nombreCompleto}</td>
                                            <td>
                                                <ul>{item.asignacionCama.solicitudCama.versionSolicitud.diagnosticos.map((diagnostico) => (
                                                    <li key={diagnostico.id}>{diagnostico.nombre}</li>                                                
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>
                                                <ul>{item.asignacionCama.solicitudCama.versionSolicitud.titulosFormacionAcademica.map((especialidad) => (
                                                    <li key={especialidad.id}>{especialidad.titulo}</li>                                                
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>{item.asignacionCama.solicitudCama.versionSolicitud.requiereAislamiento ? 'SI' : 'NO'}</td>
                                            <td>{item.asignacionCama.estado.nombre}</td>
                                            <td>{item.servicio.nombre}</td>
                                            <td>{item.cama.codigo}</td>
                                            <td>{item.extension}</td>
                                            <td>{item.enfermeroOrigen}</td>
                                            <td>{item.enfermeroDestino}</td>
                                            <td>{item.observacion}</td>
                                            <td>{item.usuario.nombreCompleto}</td>
                                            <td>
                                                <div className="btn-group">
                                                    {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION'].some(role => authorities.includes(role)) && (
                                                        <button type="button" className="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Finalizar Traslado" onClick={() => handleFinalizar(item)}> 
                                                            <i className="bi bi-check-circle"></i>
                                                        </button>
                                                    )}
                                                    {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION'].some(role => authorities.includes(role)) && (
                                                        <button type="button" className="btn btn-info btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cancelar" onClick={() => handleCancelar(item)}> 
                                                            <i className="bi bi-x-circle"></i>
                                                        </button>
                                                    )}
                                                    {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_ENFERMERO_INTERNACION'].some(role => authorities.includes(role)) && (
                                                        <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar" onClick={() => handleEditar(item)}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                        </tbody>
                    </table>
                </div>
            </div>
            <InfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false) } data={selectedItem}/>
            <FormEditAsignCama showModalFormEditAsignacion={showModalFormEditAsignacion} handleCloseModalFormEditAsignacion={() => setShowModalFormEditAsignacion(false)} idBloqueServicio={bloqueServicioSeleccionado} versionAsignacionSolicitudCama={versionAsignacionSolicitudCama} setVersionAsignacionSolicitudCamaEditar={setVersionAsignacionSolicitudCamaEditar}/>
        </>
    )
}
