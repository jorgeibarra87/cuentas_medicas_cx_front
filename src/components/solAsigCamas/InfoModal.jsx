import React from 'react'
import { Modal } from 'react-bootstrap';
import { FormatearFecha } from '../../utilities/FormatearFecha';

function InfoModal({show, handleClose, data}) {
    if(!data) return null;
    console.log(data);
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <span>Información Solicitud</span>
        </Modal.Header>
        <Modal.Body>
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          <li><strong>ID Solicitud:</strong>{data.asignacionCama.solicitudCama.id} </li>
          <li><strong>ID Modificación:</strong>{data.asignacionCama.solicitudCama.versionSolicitud[0].id}</li>
          <li><strong>Fecha:</strong>{FormatearFecha(data.asignacionCama.solicitudCama.versionSolicitud[0].fecha)} </li>
          <li><strong>Género:</strong>{data.asignacionCama.solicitudCama.ingreso.paciente.genero} </li>
          <li><strong>Proceso:</strong> {data.asignacionCama.solicitudCama.versionSolicitud[0].servicio.nombre}</li>
          <li><strong>Requiere Aislamiento:</strong>{data.asignacionCama.solicitudCama.versionSolicitud[0].requiereAislamiento ? 'SI' : 'NO '} </li>
          <li><strong>Otra Especialidad:</strong>
            <ul> {data.asignacionCama.solicitudCama.versionSolicitud[0].titulosFormacionAcademica.map((especialidad) => (
                <li key={especialidad.id}>{especialidad.titulo}</li>
                ))}
            </ul>
          </li>
          <li><strong>Requerimiento Especial:</strong> {data.asignacionCama.solicitudCama.versionSolicitud[0].requerimientosEspeciales}</li>
          <li><strong>Motivo:</strong> {data.asignacionCama.solicitudCama.versionSolicitud[0].motivo}</li>
          <li><strong>Diagnóstico:</strong>
            <ul> {data.asignacionCama.solicitudCama.versionSolicitud[0].diagnosticos.map((diagnostico) => (
                <li key={diagnostico.id}>{diagnostico.nombre}</li>
                ))}
            </ul>
          </li>
          <li><strong>Responsable Solicitud:</strong> {data.asignacionCama.solicitudCama.versionSolicitud[0].usuario.nombreCompleto}</li>
        </ul>
        </Modal.Body>
    </Modal>
  )
}

export default InfoModal