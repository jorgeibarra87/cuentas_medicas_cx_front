import { useEffect } from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import AsignarSolicitud from './FormDocSolicitud';
import spinnerLoginText from "../Loading";
import { FormatearFecha } from '../../utilities/FormatearFecha';
import FormAsignCama from './FormAsignCama';
import icono from '../../../public/camaicono.ico'
import FormEditSolicitudCama from './FormEditSolicitudCama';
import { useSelector } from 'react-redux';
import { obtenerBloquesServicio } from '../../api/asignacionCamas/bloqueServicioService';
import { obtenerEspecialidades } from '../../api/asignacionCamas/especialidadService';
import { cambiarEstadoFacturacionVersionSolicitudCama, obtenerVersionesSolicitudCamaActivasByIdBloque } from '../../api/asignacionCamas/versionSolicitudCamaService';
import { cancelarSolicitudCama } from '../../api/asignacionCamas/solicitudCamaService';

function SolicitudCama() {

    const statelogin = useSelector(state => state.login);

    const [authorities] = useState(statelogin.decodeToken.authorities);    

    const [versionSolicitudesActivas, setVersionSolicitudesActivas] = useState([]);
    const [showModalSolicitud, setShowModalSolitud] = useState(false);
    const [showModalFormAsignacion, setShowModalFormAsignacion] = useState(false);
    const [solicitudCama, setSolicitudCama] = useState(null);
    const [showFormEditSolicitudCama, setShowFormEditSolicitudCama] = useState(false);
    const [versionSolicitudCama, setVersionSolicitudCama] = useState(null); // dato para editar
    const [bloquesServicio, setBloquesServicio] = useState([]);
    const [bloqueServicioSeleccionado, setBloqueServicioSeleccionado] = useState(0);
    const [responseEditar, setResponseEditar] = useState(null);
    const [stateAsignacion, setStateAsignacion] = useState(null);
    // const [servicios, setServicios] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);


    useEffect(() => {
        //cambiar icono 
        const link = document.querySelector("link[rel='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = icono; // Usa el path del icono importado
        document.head.appendChild(link);
        //cambia el titulo
        document.title = "Solicitudes de Cama";
    },[])

    useEffect(() => {
        // async para obtener los bloques de servicio y especialidades
        const getBloquesServicio = async () => {
            const response = await obtenerBloquesServicio();
            setBloquesServicio(response);
        }

        if (bloquesServicio.length === 0) getBloquesServicio();
        
        if (especialidades.length === 0) {
            const getEspecialidades = async () => {
                await obtenerEspecialidades()
                    .then(response => {
                        setEspecialidades(response);
                    }).catch(error => {
                        console.error(error);
                    });
            }
            getEspecialidades();
        }

    }, []);

    useEffect(() => {
        if (bloqueServicioSeleccionado == '0') {
            setVersionSolicitudesActivas([]);
            return;
        }
        const getVersionesSolicitudCama = async () => {
            await obtenerVersionesSolicitudCamaActivasByIdBloque(bloqueServicioSeleccionado)
                .then(response => {
                    setVersionSolicitudesActivas(response);
                    // Swal.close();
                }).catch(error => {
                    console.error(error);
                });
        }
        if (bloqueServicioSeleccionado != null && bloqueServicioSeleccionado !== "") {
            spinnerLoginText("Cargando...");
            getVersionesSolicitudCama();
        }
    }, [bloqueServicioSeleccionado]);

    //useEffect oara inicializar los tooltips
    // useEffect(() => {
    //     const existingTooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    //     existingTooltips.forEach(tooltipEl => {
    //         const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipEl);
    //         if (tooltipInstance) {
    //             tooltipInstance.dispose();
    //         }
    //     });
    //     // Inicializar nuevos tooltips
    //     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    //     tooltipTriggerList.forEach(tooltipTriggerEl => {
    //         new bootstrap.Tooltip(tooltipTriggerEl);
    //     });
    // }, [versionSolicitudesActivas]);

    useEffect(() => {
        if (bloqueServicioSeleccionado == '0') {
            return;
        }
    }, [versionSolicitudesActivas]);

    const handleFormAsignacion = (item) => {
        setSolicitudCama(item);
        setShowModalFormAsignacion(true);
    }

    const handleCanel = async (item) => {

        // try {
        //     const { value: motivo } = await Swal.fire({
        //         title: 'Cancelar Solicitud',
        //         text: 'Por favor ingresa el motivo de la cancelación:',
        //         input: 'text',
        //         showCancelButton: true,
        //         confirmButtonText: 'Cancelar solicitud',
        //         cancelButtonText: 'Regresar',
        //         inputValidator: (value) => {
        //             if (!value) {
        //                 return 'El motivo es obligatorio';
        //             }
        //         }
        //     });
        //     if (!motivo) return;
        //     // Realizar la solicitud PUT con Axios
        //     const response = await cancelarSolicitudCama(item.solicitudCama.id, motivo);
        //     Swal.fire({
        //         title: 'Solicitud Cancelada',
        //         text: 'La solicitud ha sido cancelada exitosamente.',
        //         icon: 'success',
        //         confirmButtonText: 'Aceptar'
        //     });
        //     const versionesActualizadas = versionSolicitudesActivas.filter((version) => version.id !== item.id);
        //     setVersionSolicitudesActivas(versionesActualizadas);
        //     return response.data;
        // } catch (error) {
        //     console.error(error);
        // }
    }

    const handleChangeFacturacion = async (item) => {
        await cambiarEstadoFacturacionVersionSolicitudCama(item.id)
            .then(response => {
                setVersionSolicitudesActivas(versionSolicitudesActivas.map((version) => {
                    if (version.id === item.id) {
                        return { ...version, autorizacionFacturacion: response.autorizacionFacturacion };
                    }
                    return version;
                }));
                // setTimeout(() => {
                //     const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                //     tooltipTriggerList.forEach(tooltipTriggerEl => {
                //         new bootstrap.Tooltip(tooltipTriggerEl);
                //     });
                // }, 0);
            }).catch(error => {
                console.error(error);
            });
    }

    const handleBloqueServicio = (e) => {
        const { value } = e.target;
        setBloqueServicioSeleccionado(value);
    };

    const handleEditar = (item) => {
        setVersionSolicitudCama(item);
        setShowFormEditSolicitudCama(true);
    }

    useEffect(() => {
        if (stateAsignacion != null) {
            const versionesA = versionSolicitudesActivas.filter((version) => version.solicitudCama.id !== stateAsignacion.asignacionCama.solicitudCama.id);
            setVersionSolicitudesActivas(versionesA);
        }
    }, [stateAsignacion]);

    useEffect(() => {
        if (responseEditar != null) {
            setVersionSolicitudesActivas(versionSolicitudesActivas.map((version) => {
                if (version.solicitudCama.id === responseEditar.solicitudCama.id) {
                    return { ...responseEditar };
                }
                return version;
            }));
        }
    }, [responseEditar]);

    return (
        <>
            <div>
                {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_MEDICO_ESPECIALISTA'].some(role => authorities.includes(role)) && (
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
                )}
                <div className="row align-items-start">
                    <div className="col-2 mx-2 py-2">
                        <select className="form-select form-select-sm" name='bloqueServicio' onChange={handleBloqueServicio}>
                            <option value="0">Selecciona el bloque</option>
                            {bloquesServicio.map((item) => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="table-container">
                        <table className="table table-hover table-bordered table-sm table-small-text">
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
                                    <th>Motivo</th>
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
                                        <td>{item.motivo}</td>
                                        <td>{
                                            item.medidasAislamiento == null ? 'Ninguna' :
                                                item.medidasAislamiento.map((medida) => (
                                                    <ul key={medida.id}>
                                                        <li>{medida.nombre}</li>
                                                    </ul>
                                                ))
                                        }
                                        </td>
                                        <td>
                                            <ul>{
                                                item.diagnosticos.map((diagnostico) =>
                                                    (<li key={diagnostico.id}>{diagnostico.nombre}</li>))
                                            }
                                            </ul>
                                        </td>
                                        <td><ul>
                                            {
                                                item.titulosFormacionAcademica.map((especialidad) =>
                                                    (<li key={especialidad.id}>{especialidad.titulo}</li>))
                                            }
                                        </ul>
                                        </td>
                                        <td>{item.requerimientosEspeciales}</td>
                                        <td>{item.asignacionCama == null ? 
                                            <>{item.solicitudCama.estado.nombre}</>:
                                            <>{item.asignacionCama.estado.nombre}<br></br><p className="fw-bold">motivo:</p> {item.asignacionCama.versionSolicitudAsignacion.motivo_cancelacion}</>
                                            }
                                        </td>
                                        <td>{item.autorizacionFacturacion}</td>
                                        <td>
                                            <div className="btn-group">
                                                {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_FACTURACION'].some(role => authorities.includes(role)) && (
                                                    <button type="button" className="btn btn-light btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cambiar Estado Facturación" onClick={() => handleChangeFacturacion(item)}>
                                                        {item.autorizacionFacturacion === 'SI' ? (<i className="bi bi-toggle-on"></i>) : item.autorizacionFacturacion === 'NO' ? (<i className="bi bi-toggle-off"></i>) : (<i className="bi bi-hourglass-split"></i>)}
                                                    </button>
                                                )}
                                                {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION'].some(role => authorities.includes(role)) &&(
                                                    <button type="button" className="btn btn-info btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Cancelar" onClick={() => handleCanel(item)} >
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                )}
                                                {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION'].some(role => authorities.includes(role)) && (
                                                    <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Editar" onClick={() => handleEditar(item)} >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                )}
                                                {['ROLE_ADMIN','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_ENFERMERO_INTERNACION'].some(role => authorities.includes(role)) && item.autorizacionFacturacion === 'SI' ? (
                                                        <button type="button" className="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Asignar Cama" onClick={() => handleFormAsignacion(item)}>
                                                            <FontAwesomeIcon icon={faBed} />
                                                        </button>
                                                    ) : ''
                                                }
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
            <FormAsignCama showModalFormAsignacion={showModalFormAsignacion} handleCloseModalFormAsignacion={() => setShowModalFormAsignacion(false)} solicitudCama={solicitudCama} setStateAsignacion={setStateAsignacion} />
            <FormEditSolicitudCama versionSolicitudCama={versionSolicitudCama} showFormEditSolicitudCama={showFormEditSolicitudCama} handleCloseFormEditSolicitudCama={() => setShowFormEditSolicitudCama(false)} setResponseEditar={setResponseEditar} />
        </>
    )
}

export default SolicitudCama