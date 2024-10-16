import React from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";

function SolicitudCama() {

    const [data] = useState([
        {
            id: 76,
            identificador: 14,
            fecha_solicitud: "15-03-24 11:15",
            ingreso: 56321,
            identifacion: 107843567,
            paciente: "Carlos Martinez",
            genero: "M",
            servicio: "Cuidados Intensivos",
            bloque: "Unidad de Cuidados Intensivos",
            requiereAisalmiento: "sí",
            Dianostico: "Neumonía viral",
            Especialidad_Tratante: "Neumología",
            Otra: "",
            RequerimientosEspeciales: "Oxigenoterapia",
            TipoAislamiento: "Contacto",
            MotivoAislamiento: "Riesgo de infección ",
            Dianositico: "Dianostico",
            Responsable_Solicitud: "Jorge Ruiz Salazar",
            estado: "Registrado",
            AutorizacionFacturacion: "Autorizado"
        },
        {
            id: 77,
            identificador: 15,
            fecha_solicitud: "16-03-24 09:30",
            ingreso: 54875,
            identifacion: 106892345,
            paciente: "Ana López",
            genero: "F",
            servicio: "Hospitalización Pediátrica",
            bloque: "Pediatría",
            requiereAisalmiento: "no",
            Dianostico: "Fiebre de origen desconocido",
            Especialidad_Tratante: "Pediatría",
            Otra: "",
            RequerimientosEspeciales: "Monitoreo constante",
            TipoAislamiento: "",
            MotivoAislamiento: "",
            Dianositico: "Dianostico",
            Responsable_Solicitud: "Clara Gómez Sánchez",
            estado: "Registrado",
            AutorizacionFacturacion: "En espera"
        },
        {
            id: 78,
            identificador: 16,
            fecha_solicitud: "17-03-24 12:45",
            ingreso: 57319,
            identifacion: 109876543,
            paciente: "Laura Mejía",
            genero: "F",
            servicio: "Oncología",
            bloque: "Quimioterapia",
            requiereAisalmiento: "sí",
            Dianostico: "Cáncer de mama",
            Especialidad_Tratante: "Oncología",
            Otra: "",
            RequerimientosEspeciales: "Acceso venoso central",
            TipoAislamiento: "Protección",
            MotivoAislamiento: "Sistema inmunológico debilitado",
            Dianositico: "Dianostico",
            Responsable_Solicitud: "Sonia Ramos Peña",
            estado: "En tratamiento",
            AutorizacionFacturacion: "Autorizado"
        },
        {
            id: 79,
            identificador: 17,
            fecha_solicitud: "18-03-24 14:00",
            ingreso: 56123,
            identifacion: 108654321,
            paciente: "Miguel Rodríguez",
            genero: "M",
            servicio: "Cardiología",
            bloque: "Unidad Coronaria",
            requiereAisalmiento: "no",
            Dianostico: "Infarto agudo de miocardio",
            Especialidad_Tratante: "Cardiología",
            Otra: "",
            RequerimientosEspeciales: "Monitoreo cardiaco",
            TipoAislamiento: "",
            MotivoAislamiento: "",
            Dianositico: "Dianostico",
            Responsable_Solicitud: "Alejandra Vargas Fernández",
            estado: "Estabilizado",
            AutorizacionFacturacion: "Autorizado"
        },
        {
            id: 80,
            identificador: 18,
            fecha_solicitud: "19-03-24 08:50",
            ingreso: 54789,
            identifacion: 109453627,
            paciente: "Lucía Ramírez",
            genero: "F",
            servicio: "Ginecología",
            bloque: "Sala de Parto",
            requiereAisalmiento: "no",
            Dianostico: "Embarazo a término",
            Especialidad_Tratante: "Ginecología",
            Otra: "",
            RequerimientosEspeciales: "Asistencia en el parto",
            TipoAislamiento: "",
            MotivoAislamiento: "",
            Dianositico: "Dianostico",
            Responsable_Solicitud: "María Torres González",
            estado: "En espera",
            AutorizacionFacturacion: "Autorizado"
        }
    ]);

    return (
        <>
            <div>
                <h4 className="text-center">
                    Bloque Actual: Internación General Adultos
                </h4>
                <div className="row align-items-start">
                    <div className="col-auto mx-5 py-2">
                        <h4>Agregar Solicitud</h4>
                    </div>
                    <div className="col-auto py-1" style={{ fontSize: "1.5rem" }}>
                        <button className="btn">  {/** onClick={() => handleOpenModalSolicitud()}*/}
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
                                    <th>Diagnóstico</th>
                                    <th>Especialidad</th>
                                    <th>Requerimientos</th>
                                    <th>Estado</th>
                                    <th>Facturación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.identificador}</td>
                                        <td>{item.fecha_solicitud}</td>
                                        <td>{item.ingreso}</td>
                                        <td>{item.identifacion}</td>
                                        <td>{item.paciente}</td>
                                        <td>{item.genero}</td>
                                        <td>{item.servicio}</td>
                                        <td>{item.bloque}</td>
                                        <td>{item.requiereAisalmiento}</td>
                                        <td>{item.Dianositico}</td>
                                        <td>{item.Especialidad_Tratante}</td>
                                        <td>{item.requiereAisalmiento}</td>
                                        <td>{item.estado}</td>
                                        <td>{item.AutorizacionFacturacion}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn" > {/**onClick={() => toggleIcon(item.id)} */}
                                                    <i className="bi bi-hourglass-split"></i>
                                                </button>
                                                <button className="btn"  > {/**onClick={() => handleDelete(item)} */}
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                                <button className="btn"  >{/**onClick={() => handleSubmitEditar(item)} */}
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn"  >{/**onClick={() => handleSubmitCamas(item)} */}
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
        </>
    )
}

export default SolicitudCama