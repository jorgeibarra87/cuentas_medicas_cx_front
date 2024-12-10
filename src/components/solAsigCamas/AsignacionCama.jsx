import React, { useEffect, useState } from 'react'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { FormatearFecha } from '../../utilities/FormatearFecha';
import { Client } from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';
import icono from '../../img/camillero.ico';
import Swal from 'sweetalert2';
import spinnerLoginText from '../Loading';

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

    const axiosInstance = UseAxiosInstance();

    const [asignacionesCama, setAsignacionesCama] = useState([]);
    const [bloquesServicio, setBloquesServicio] = useState([]);
    const [bloqueServicioSeleccionado, setBloqueServicioSeleccionado] = useState(null);
    const [permission, setPermission] = useState(Notification.permission);

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
        if(bloquesServicio.length === 0){
            axiosInstance.get(`bloque-servicio`)
                .then(response => {
                    setBloquesServicio(response.data);
                }).catch(error => {
                    console.error(error);
                });
        }
        
    }, []);

    console.log('asignacionesCama', asignacionesCama);  

    useEffect(() => {
        const getVersionesSolicitudCama = async () => {
            await axiosInstance.get(`asignacionVersionSolicitudCama/active/${bloqueServicioSeleccionado}`)
                .then(response => {
                    setAsignacionesCama(response.data);
                    Swal.close();
                }).catch(error => {
                    console.error(error);
                });
        }
        if(bloqueServicioSeleccionado != null && bloqueServicioSeleccionado !== ""){
            spinnerLoginText("Cargando...");
            getVersionesSolicitudCama();
        }
    }, [bloqueServicioSeleccionado]);

    const handleBloqueServicio = (e) => {
        const {value} = e.target;
        setBloqueServicioSeleccionado(value);
    };

    // useEffect(() =>{
    //     if(asignacionesCama.length === 0){
    //         axiosInstance.get(`/asignacionVersionSolicitudCama/active`)
    //         .then((response) => {
    //             setAsignacionesCama(response.data);
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    //     }
    // },[]);

    return (
        <>
            <h4 className='text-center'>ESCOGE EL BLOQUE</h4>
            <div className='row align-items-start'>
                <div className="col-2 mx-2 py-2">
                        {/* recorrer bloquesServicio en un select  */}
                        <select className="form-select form-select-sm" name='bloqueServicio' onChange={handleBloqueServicio}>
                            <option value="">Selecciona el bloque</option>
                            {bloquesServicio.map((item) => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                <div className="col-2 mx-2 py-2">
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
                </div>
            </div>
            <div className="container-fluid">
                <div className="table-container">
                    <table className="table table-hover table-bordered table-sm">
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
                                    asignacionesCama.map((item) => (
                                        <tr key={item.id}>
                                            <td></td>
                                            <td>{item.asignacionCama.id}</td>
                                            <td>{item.id}</td>
                                            <td>{item.asignacionCama.solicitudCama.versionSolicitud[0].servicio.nombre}</td>
                                            <td>{FormatearFecha(item.fechaCreacion)}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.id}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.documento}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.nombreCompleto}</td>
                                            <td>
                                                <ul>{item.asignacionCama.solicitudCama.versionSolicitud[0].diagnosticos.map((diagnostico) => (
                                                    <li key={diagnostico.id}>{diagnostico.nombre}</li>                                                
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>
                                                <ul>{item.asignacionCama.solicitudCama.versionSolicitud[0].titulosFormacionAcademica.map((especialidad) => (
                                                    <li key={especialidad.id}>{especialidad.titulo}</li>                                                
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>{item.asignacionCama.solicitudCama.versionSolicitud[0].requiereAislamiento ? 'SI' : 'NO'}</td>
                                            <td>{item.asignacionCama.estado.nombre}</td>
                                            <td>{item.servicio.nombre}</td>
                                            <td>{item.cama.codigo}</td>
                                            <td>{item.extension}</td>
                                            <td>{item.enfermero_origen}</td>
                                            <td>{item.enfermero_destino}</td>
                                            <td>{item.observacion}</td>
                                            <td>{item.usuario.nombreCompleto}</td>
                                            <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-light " data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cambiar Estado Facturación"  > {/**onClick={() => toggleIcon(item.id)} */}
                                                    {/* <i className={iconStates[item.id] || "bi bi-hourglass-split"}></i> */}
                                                {item.autorizacionFacturacion === 'SI' ? ( <i className="bi bi-toggle-on"></i> ) : item.autorizacionFacturacion === 'NO' ? ( <i className="bi bi-toggle-off"></i> ) : ( <i className="bi bi-hourglass-split"></i> )}
                                                </button>
                                                <button type="button" className="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cancelar"  > {/**onClick={() => handleDelete(item)} */}
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar"  >{/** */}
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </div>
                                        </td>
                                        </tr>
                                    ))
                                }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
