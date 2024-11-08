import React, { useEffect, useState } from 'react'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { FormatearFecha } from '../../utilities/FormatearFecha';
import { Client } from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8004/ws-notifications'; 
const client = new Client(
    { 
        brokerURL: SOCKET_URL, 
        webSocketFactory: () => new SockJS(SOCKET_URL), 
        onConnect: () => { 
            console.log('Connected'); 
            client.subscribe('/topic/notifications', 
                (message) => { 
                    if (message.body) { 
                        console.log(message.body); 
                    } 
                }); 
            }, 
            onStompError: (frame) => { 
                console.error(`Broker reported error: ${frame.headers['message']}`); 
                console.error(`Additional details: ${frame.body}`); 
            } 
        });

export const connect = () => {
    try {
        client.activate();
    } catch (error) {
        console.error(error);
    }
}; 
export const disconnect = () => { 
    client.deactivate(); 
};

export default function AsignacionCama() {

    const axiosInstance = UseAxiosInstance();

    const [asignacionesCama, setAsignacionesCama] = useState([]);

    const [notifications, setNotifications] = useState([]);

    
    useEffect(() => {
        connect(); return () => disconnect();
    }, []);

    useEffect(() =>{
        if(asignacionesCama.length === 0){
            axiosInstance.get(`/asignacionVersionSolicitudCama/active`)
            .then((response) => {
                setAsignacionesCama(response.data);
            }).catch((error) => {
                console.error(error);
            });
        }
    },[]);

    return (
        <>
            <h4 className='text-center'>ESCOGE EL BLOQUE</h4>
            <div className='row align-items-start'>
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
                                    "Responsable Asignacion"
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
                                            <td>{}</td>
                                            <td>{FormatearFecha(item.fechaModificacion)}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.id}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.documento}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.documento}</td>
                                            <td>{item.asignacionCama.solicitudCama.ingreso.paciente.nombreCompleto}</td>
                                            <td></td>
                                            <td>{}</td>
                                            <td>{item.asignacionCama.estado.nombre}</td>
                                            <td>{item.servicio.nombre}</td>
                                            <td>{item.cama.codigo}</td>
                                            <td>{item.extension}</td>
                                            <td>{item.enfermero_origen}</td>
                                            <td>{item.enfermero_destino}</td>
                                            <td>{item.observacion}</td>
                                            <td>{item.usuario.nombreCompleto}</td>
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
