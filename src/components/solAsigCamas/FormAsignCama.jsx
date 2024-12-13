import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Select from 'react-select'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';

const initialFormState = {
    asignacionCama: {
        idSolicitudCama: ''
    },
    cama: {
        id: '',
        codigo: ''
    },
    observacion: '',
    enfermero_origen: '',
    enfermero_destino: '',
    extension: '',
    servicio: {
        id: ''
    }
}

export default function FormAsignCama({ showModalFormAsignacion, handleCloseModalFormAsignacion, solicitudCama, setStateAsignacion }) {

    const axiosInstance = UseAxiosInstance();
    const [form, setForm] = useState(initialFormState);
    const [camas, setCamas] = useState([]);
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        
        if (showModalFormAsignacion) {
            setForm({
                ...form, asignacionCama: { idSolicitudCama: solicitudCama.solicitudCama.id }
            })
            axiosInstance.get(`/servicio/${solicitudCama.bloqueServicio.id}`)
                .then((response) => {
                    setServicios(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }, [showModalFormAsignacion]);

    const opcionesServicios = servicios.map(servicio => ({ value: servicio.id, label: servicio.nombre }));

    const handleSelect = (itemSelect, e) => {
        
        
        if (e.name === 'servicios') {
            const servicio = { id: itemSelect.value, nombre: itemSelect.label };
            setForm({
                ...form, servicio: servicio
            })
            axiosInstance.get(`/cama/${itemSelect.value}`)
                .then((response) => {
                    setCamas(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }else{
            const cama = { id: itemSelect.value, codigo: itemSelect.label };
            setForm({
                ...form, cama: cama
            })
        }

    }

    const opcionesCamas = camas.map(cama => ({ value: cama.id, label: cama.codigo }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form, [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.post('/asignacionVersionSolicitudCama', form)
            .then(response => {
                
                setForm(initialFormState);
                handleCloseModalFormAsignacion();
                setStateAsignacion(response.data);
            }).catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <Modal show={showModalFormAsignacion} onHide={handleCloseModalFormAsignacion} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Cama a la solicitud: {solicitudCama != null ? solicitudCama.id : ''} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} id='formulario'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <label className='form-label'>Observación</label>
                                <input type='text' name='observacion' className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Extensión</label>
                                <input type='text' name='extension' className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Origen</label>
                                <input type='text' name='enfermero_origen' className='form-control' onChange={handleChange} />
                            </div>
                        </div>
                        <div className='row my-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Destino</label>
                                <input type='text' name='enfermero_destino' className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Servicio Destino</label>
                                <Select options={opcionesServicios} className='basic-single' classNamePrefix='select' placeholder='Elige un servicio...' name='servicios' onChange={handleSelect} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Cama Destino</label>
                                <Select options={opcionesCamas} className='basic-single' classNamePrefix='select' placeholder='Elija una cama...' name='camas' onChange={handleSelect} />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' type='submit' form='formulario'>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}