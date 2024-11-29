import React, { useEffect } from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import AsignarSolicitud from './FormDocSolicitud';
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import spinnerLoginText from "../Loading";
import Swal from 'sweetalert2';
import { FormatearFecha } from '../../utilities/FormatearFecha';
import FormAsignCama from './FormAsignCama';
import * as bootstrap from 'bootstrap';

function SolicitudCama() {

    const axiosInstance = UseAxiosInstance();

    const [versionSolicitudesActivas, setVersionSolicitudesActivas] = useState([]);
    const [showModalSolicitud, setShowModalSolitud] = useState(false);
    const [showModalFormAsignacion, setShowModalFormAsignacion] = useState(false);
    const [solicitudCama, setSolicitudCama] = useState(null);

    useEffect(() => {
        spinnerLoginText("Cargando...");
        const getVersionesSolicitudCama = async () => {
            await axiosInstance.get(`versionSolicitudCama/active`)
                .then(response => {
                    setVersionSolicitudesActivas(response.data);
                    Swal.close();
                }).catch(error => {
                    console.error(error);
                });
        }
        if(versionSolicitudesActivas.length === 0){
            getVersionesSolicitudCama();
        }
    }, []);

    useEffect(() => {
        if (versionSolicitudesActivas.length > 0) {
            Swal.close();
        }
    }, [versionSolicitudesActivas]);

    //useEffect oara inicializar los tooltips
    useEffect(() => {
        const existingTooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        existingTooltips.forEach(tooltipEl => {
            const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipEl);
            if (tooltipInstance) {
                tooltipInstance.dispose();
            }
        });

        // Inicializar nuevos tooltips
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }, [versionSolicitudesActivas]);

    const handleFormAsignacion = (item) => {
        setSolicitudCama(item);
        setShowModalFormAsignacion(true);
    }

    const handleCanel = async (item) => {

        try {
            const { value: motivo } = await Swal.fire({
                title: 'Cancelar Solicitud',
                text: 'Por favor ingresa el motivo de la cancelación:',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'Cancelar solicitud',
                cancelButtonText: 'Regresar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'El motivo es obligatorio';
                    }
                }
            });

            if (!motivo) {
                return; // Salimos si el usuario cancela o no escribe un motivo
            }

            // Realizar la solicitud PUT con Axios
            const response = await axiosInstance.put(`/solicitudCama/cancelar/${item.solicitudCama.id}`, null, {
                params: { motivo }
            });

            // Mostrar mensaje de éxito si la solicitud fue completada
            Swal.fire({
                title: 'Solicitud Cancelada',
                text: 'La solicitud ha sido cancelada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Hola, Tooltip!" > Prueba Tooltip </button>
            <div>
                <div className="row align-items-start">
                    <div className="col-auto mx-5 py-2">
                        <h4>Agregar Solicitud</h4>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-lg" onClick={() => setShowModalSolitud(true)} >
                            <i className="bi bi-plus-circle-fill text-primary"></i>
                        </button>
                    </div>
                </div>
                <div className="row align-items-start">
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
                                    <th>ID</th>
                                    <th>Identificador</th>
                                    <th>Fecha Solicitud</th>
                                    <th>Ingreso</th>
                                    <th>Identificación</th>
                                    <th>Paciente</th>
                                    <th>Género</th>
                                    <th>Servicio</th>
                                    <th>Bloque</th>
                                    <th>Requiere Aislamiento</th>
                                    <th>Medidas de Aislamiento</th>
                                    <th>Diagnóstico</th>
                                    <th>Especialidad</th>
                                    <th>Requerimientos</th>
                                    <th>Estado</th>
                                    <th>Facturación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {versionSolicitudesActivas.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.solicitudCama.id}</td>
                                        <td>{item.id}</td>
                                        <td>{FormatearFecha(item.fecha)}</td>
                                        <td>{item.solicitudCama.ingreso.id}</td>
                                        <td>{item.solicitudCama.ingreso.paciente.documento}</td>
                                        <td>{item.solicitudCama.ingreso.paciente.nombreCompleto}</td>
                                        <td>{item.solicitudCama.ingreso.paciente.genero}</td>
                                        <td>{item.servicio.nombre}</td>
                                        <td>{item.bloqueServicio.nombre}</td>
                                        <td>{item.requiereAislamiento ? 'SI' : 'NO'}</td>
                                        <td>{
                                            item.medidasAislamiento.map((medida) => (
                                                <ul key={medida.id}>
                                                    <li>{medida.nombre}</li>
                                                </ul>
                                            ))
                                        }
                                        </td>
                                        <td>{
                                            item.diagnosticos.map((diagnostico) => (
                                                <ul key={diagnostico.id}>
                                                    <li>{diagnostico.nombre}</li>
                                                </ul>
                                            ))
                                        }
                                        </td>
                                        <td>
                                            {
                                                item.titulosFormacionAcademica.map((especialidad) => (
                                                    <ul key={especialidad.id}>
                                                        <li>{especialidad.titulo}</li>
                                                    </ul>
                                                ))
                                            }
                                        </td>
                                        <td>{item.requerimientosEspeciales}</td>
                                        <td>{item.solicitudCama.estado.nombre}</td>
                                        <td>{item.autorizacionFacturacion}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-light " data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cambiar Estado Facturación"  > {/**onClick={() => toggleIcon(item.id)} */}
                                                    <i className="bi bi-hourglass-split"></i>
                                                </button>
                                                <button type="button" className="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cancelar" onClick={() => handleCanel(item)} > {/**onClick={() => handleDelete(item)} */}
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar"  >{/**onClick={() => handleSubmitEditar(item)} */}
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button type="button" className="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Asignar Cama" onClick={() => handleFormAsignacion(item)}>{/**onClick={() => handleSubmitCamas(item)} */}
                                                    <FontAwesomeIcon icon={faBed} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AsignarSolicitud showModalSolicitud={showModalSolicitud} handleCloseModalSolicitud={() => setShowModalSolitud(false)} />
            <FormAsignCama showModalFormAsignacion={showModalFormAsignacion} handleCloseModalFormAsignacion={() => setShowModalFormAsignacion(false)} solicitudCama={solicitudCama}/>
        </>
    )
}

export default SolicitudCama