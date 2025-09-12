import { useEffect, useState } from 'react'
import Select from 'react-select'
import { obtenerServiciosByBloqueId } from '../../api/asignacionCamas/solicitudCamaService';
import { modificarVersionAginacionSolicitudCama } from '../../api/asignacionCamas/asignacionVersionSolCamaService';
import { obtenerEstadoDeCamas } from '../../api/dinamica/hpnDefCamService';
import { obtenerCamasPorServicio } from '../../api/asignacionCamas/camaService';

const initialFormState = {
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

export default function FormEditAsignCama({ showModalFormEditAsignacion, handleCloseModalFormEditAsignacion, idBloqueServicio, versionAsignacionSolicitudCama, setVersionAsignacionSolicitudCamaEditar }) {

    const [form, setForm] = useState(initialFormState);
    const [camas, setCamas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [camaSeleccionada, setCamaSeleccionada] = useState(null);
    const [botonEditar, setBotonEditar] = useState(false);

    useEffect(() => {
        const obtenerServicio = async () => {
            obtenerServiciosByBloqueId(idBloqueServicio)
                .then((response) => {
                    setServicios(response);
                }).catch((error) => {
                    console.error(error);
                });

        }
        if (showModalFormEditAsignacion) {
            obtenerServicio();
                setServicioSeleccionado({ value: versionAsignacionSolicitudCama.servicio.id, label: versionAsignacionSolicitudCama.servicio.nombre });
                setCamaSeleccionada({ value: versionAsignacionSolicitudCama.cama.id, label: versionAsignacionSolicitudCama.cama.codigo });

                setForm((prevState) => ({
                    ...prevState,
                    cama: {
                        id: versionAsignacionSolicitudCama.cama.id,
                        codigo: versionAsignacionSolicitudCama.cama.codigo
                    },
                    observacion: versionAsignacionSolicitudCama.observacion,
                    enfermeroOrigen: versionAsignacionSolicitudCama.enfermeroOrigen,
                    enfermeroDestino: versionAsignacionSolicitudCama.enfermeroDestino,
                    extension: versionAsignacionSolicitudCama.extension,
                    servicio: {
                        id: versionAsignacionSolicitudCama.servicio.id
                    }
                }))
        }
    }, [showModalFormEditAsignacion]);


    useEffect(() => {
        if(versionAsignacionSolicitudCama != null && form !== initialFormState){
            setBotonEditar(!hasChanges(versionAsignacionSolicitudCama, form));
        }
    }, [form, versionAsignacionSolicitudCama]);

    function hasChanges(original, updated){
        if(String(original.observacion).toLocaleUpperCase() !== String(updated.observacion).toLocaleUpperCase()) return true;
        if(String(original.enfermeroOrigen).toUpperCase() !== String(updated.enfermeroOrigen).toUpperCase()) return true;
        if(String(original.enfermeroDestino).toUpperCase() !== String(updated.enfermeroDestino).toUpperCase()) return true;
        if(String(original.extension).toUpperCase() !== String(updated.extension).toUpperCase()) return true;
        if(original.servicio.id !== updated.servicio.id) return true;
        if(original.cama != null && updated.cama != null) {
            if(original.cama.id !== updated.cama.id) return true;
        }
        return false;
    }

    const opcionesServicios = servicios.map(servicio => ({ value: servicio.id, label: servicio.nombre }));

    const handleSelect = (itemSelect, e) => {

        const getCamasByServicio = async (idServicio) => {
            return await obtenerCamasPorServicio(idServicio);
        }
        
        if (e.name === 'servicios') {
            setServicioSeleccionado(itemSelect);
            setCamaSeleccionada(null);
            const servicio = { id: itemSelect.value, nombre: itemSelect.label };
            setForm({
                ...form, servicio: servicio, cama: null
            })
            getCamasByServicio(itemSelect.value)
                .then((response) => {
                    setCamas(response);
                    obtenerEstadoCamaPorCodigos(response);
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
        const obtenerEstadoDeCam = async (data) => {
            return await obtenerEstadoDeCamas(data);
        }
        obtenerEstadoDeCam(data)
            .then((response) => {
                const camasEstado = camas.map(cama => {
                    return {... cama, estadoDgh: response.find(c => c.hcaCodigo === cama.codigo).hcaEstado};
                });
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
        const asignarVerSolCama = async (idVerAsigSolCama, data) => {
            await modificarVersionAginacionSolicitudCama(idVerAsigSolCama, data);
        }
        asignarVerSolCama(versionAsignacionSolicitudCama.id, form)
            .then(response => {
                setForm(initialFormState);
                handleCloseModalFormEditAsignacion();
                setVersionAsignacionSolicitudCamaEditar(response);
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
                                <input type='text' name='observacion' value={form.observacion || ''} className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Extensión</label>
                                <input type='text' name='extension' value={form.extension || ''} className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Origen</label>
                                <input type='text' name='enfermeroOrigen' value={form.enfermeroOrigen || ''} className='form-control' onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className='row my-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>Enfermero Servicio Destino</label>
                                <input type='text' name='enfermeroDestino' value={form.enfermeroDestino || ''} className='form-control' onChange={handleChange} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Servicio Destino</label>
                                <Select options={opcionesServicios} className='basic-single' value={servicioSeleccionado || ''} classNamePrefix='select' placeholder='Elige un servicio...' name='servicios' onChange={handleSelect} required/>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>Cama Destino</label>
                                <Select options={opcionesCamas} className='basic-single' value={camaSeleccionada || ''} classNamePrefix='select' placeholder='Elija una cama...' name='camas' onChange={handleSelect} required  formatOptionLabel={(option) => {return formatOptionLabel(option)}}/>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    {!botonEditar && <Button variant='primary' type='submit' form='formulario'>Editar</Button>}
                </Modal.Footer>
            </Modal>
        </>
    )
}