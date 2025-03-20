import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Select from 'react-select'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';

const initialFormState = {
    asignacionCama: {
        idSolicitudCama: ''
    },
    cama: {
        id: '',
        codigo: ''
    },
    observacion: '',
    enfermeroOrigen: '',
    enfermeroDestino: '',
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
            axiosInstance.get(`/api/solicitudCamas/servicio/${solicitudCama.bloqueServicio.id}`)
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
                    // setCamas(response.data);
                    obtenerEstadoCamaPorCodigos(response.data);
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

    const formatOptionLabel = ({ value, label, estadoDgh }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', color: '#000' }}>{label}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{fontSize: '12px'}}>DGH</label>
                    <span style={{ marginTop: '4px', fontSize: '10px', color: '#666' }}>{estadoDgh}</span>
                </div>
            </div>
        )
    };


    function obtenerEstadoCamaPorCodigos(camas){
        const list = camas.map(cama => (cama.codigo));
        const data = { hcaCodigo : list };
        axiosInstance.post(`dinamica/api/hpndefcam/obetenerEstadoCamaPorCodigos`, data)
            .then((response) => {
                const camasEstado = camas.map(cama => {
                    return {... cama, estadoDgh: response.data.find(c => c.hcaCodigo === cama.codigo).hcaEstado};
                })
                setCamas(camasEstado);
            }).catch((error) => {
                setCamas(camas);
                console.error(error);
            });
    }

    const opcionesCamas = camas.map(cama => ({ value: cama.id, label: cama.codigo, estadoDgh: cama.estadoDgh }));

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
                                <input type='text' name='observacion' className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Extensión</label>
                                <input type='text' name='extension' className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Origen</label>
                                <input type='text' name='enfermeroOrigen' className='form-control' onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className='row my-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Destino</label>
                                <input type='text' name='enfermeroDestino' className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Servicio Destino</label>
                                <Select options={opcionesServicios} className='basic-single' classNamePrefix='select' placeholder='Elige un servicio...' name='servicios' onChange={handleSelect} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Cama Destino</label>
                                <Select options={opcionesCamas} className='basic-single' classNamePrefix='select' placeholder='Elija una cama...' name='camas' onChange={handleSelect} required formatOptionLabel={(option) => {return formatOptionLabel(option)}}/>
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