import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Select from 'react-select'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';

const initialFormState = {
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

export default function FormEditAsignCama({ showModalFormEditAsignacion, handleCloseModalFormEditAsignacion, idBloqueServicio, versionAsignacionSolicitudCama }) {

    const axiosInstance = UseAxiosInstance();
    const [form, setForm] = useState(initialFormState);
    const [camas, setCamas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [camaSeleccionada, setCamaSeleccionada] = useState(null);

    useEffect(() => {
        if (showModalFormEditAsignacion) {
            axiosInstance.get(`/servicio/${idBloqueServicio}`)
                .then((response) => {
                    setServicios(response.data);
                }).catch((error) => {
                    console.error(error);
                });

                setServicioSeleccionado({ value: versionAsignacionSolicitudCama.servicio.id, label: versionAsignacionSolicitudCama.servicio.nombre });
                setCamaSeleccionada({ value: versionAsignacionSolicitudCama.cama.id, label: versionAsignacionSolicitudCama.cama.codigo });

                setForm((prevState) => ({
                    ...prevState,
                    cama: {
                        id: versionAsignacionSolicitudCama.cama.id,
                        codigo: versionAsignacionSolicitudCama.cama.codigo
                    },
                    observacion: versionAsignacionSolicitudCama.observacion,
                    enfermero_origen: versionAsignacionSolicitudCama.enfermero_origen,
                    enfermero_destino: versionAsignacionSolicitudCama.enfermero_destino,
                    extension: versionAsignacionSolicitudCama.extension,
                    servicio: {
                        id: versionAsignacionSolicitudCama.servicio.id
                    }
                }))
        }
    }, [showModalFormEditAsignacion]);

    const opcionesServicios = servicios.map(servicio => ({ value: servicio.id, label: servicio.nombre }));

    const handleSelect = (itemSelect, e) => {
        
        if (e.name === 'servicios') {
            setServicioSeleccionado(itemSelect);
            setCamaSeleccionada(null);
            const servicio = { id: itemSelect.value, nombre: itemSelect.label };
            setForm({
                ...form, servicio: servicio, cama: null
            })
            axiosInstance.get(`/cama/${itemSelect.value}`)
                .then((response) => {
                    setCamas(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }else{
            setCamaSeleccionada(itemSelect);
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
        console.log('form',form);
        axiosInstance.put(`asignacionVersionSolicitudCama/${versionAsignacionSolicitudCama.id}`, form)
            .then(() => {
                setForm(initialFormState);
                handleCloseModalFormEditAsignacion();
            }).catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            <Modal show={showModalFormEditAsignacion} onHide={handleCloseModalFormEditAsignacion} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Asignaición de cama</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} id='formulario'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <label className='form-label'>Observación</label>
                                <input type='text' name='observacion' value={form.observacion} className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Extensión</label>
                                <input type='text' name='extension' value={form.extension} className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Origen</label>
                                <input type='text' name='enfermero_origen' value={form.enfermero_origen} className='form-control' onChange={handleChange} />
                            </div>
                        </div>
                        <div className='row my-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Destino</label>
                                <input type='text' name='enfermero_destino' value={form.enfermero_destino} className='form-control' onChange={handleChange} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Servicio Destino</label>
                                <Select options={opcionesServicios} className='basic-single' value={servicioSeleccionado} classNamePrefix='select' placeholder='Elige un servicio...' name='servicios' onChange={handleSelect} />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Cama Destino</label>
                                <Select options={opcionesCamas} className='basic-single' value={camaSeleccionada} classNamePrefix='select' placeholder='Elija una cama...' name='camas' onChange={handleSelect} />
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