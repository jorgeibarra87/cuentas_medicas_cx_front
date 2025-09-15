import { useEffect } from 'react'
import { useState } from 'react'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { obtenerMedidasAislamiento } from '../../api/asignacionCamas/medidasAislamientoService'
import { obtenerBloquesServicio } from '../../api/asignacionCamas/bloqueServicioService'
import { obtenerEspecialidades } from '../../api/asignacionCamas/especialidadService'
import { guardarVersionSolicitudCama } from '../../api/asignacionCamas/versionSolicitudCamaService'
import { obtenerDiagnosticos } from '../../api/asignacionCamas/diagnosticoService'

const initialFormState = {
    requiereAislamiento: false,
    motivo: '',
    requerimientosEspeciales: '',
    usuario: {
        documento: ''
    },
    solicitudCama: {
        ingreso: {
            id: '',
            fechaIngreso: '',
            paciente: {
                genero: '',
                documento: '',
                nombreCompleto: '',
                nombres: '',
                apellidos: '',
                fechaNacimiento: ''
            }
        }
    },
    servicio: {
        nombre: ''
    },
    cama: {
        codigo: '',
        nombre: ''
    },
    medidasAislamiento: [],
    titulosFormacionAcademica: [],
    diagnosticos: []
}

export default function FormSolicitudCama({ showFormSolicitud, handleCloseFormSolicitud, pacienteHospitalizado }) {

    const [form, setForm] = useState(initialFormState);
    const [especialidades, setEspecialidades] = useState([]);
    const [medidasAislamiento, setMedidasAislamiento] = useState([]);
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [bloquesServicio, setBloquesServicio] = useState([]);

    useEffect(() => {
        if(showFormSolicitud){
            setForm((prevState) => ({
                ...prevState,  // Mantén el resto del estado inicial
                usuario: {
                    ...prevState.usuario,
                    documento: 1061784598
                },
                solicitudCama: {
                    ...prevState.solicitudCama,
                    ingreso: {
                        ...prevState.solicitudCama.ingreso,
                        id: pacienteHospitalizado.ingreso || '',
                        fechaIngreso: pacienteHospitalizado.fechaIngreso || '',
                        paciente: {
                            ...prevState.solicitudCama.ingreso.paciente,
                            genero: pacienteHospitalizado.genero || '',
                            documento: pacienteHospitalizado.identificacion || '',
                            nombreCompleto: `${pacienteHospitalizado.nombres || ''} ${pacienteHospitalizado.apellidos || ''}`.trim(),
                            nombres: pacienteHospitalizado.nombres || '',
                            apellidos: pacienteHospitalizado.apellidos || '',
                            fechaNacimiento: pacienteHospitalizado.gpafecnac || ''
                        }
                    }
                },
                servicio: {
                    ...prevState.servicio,
                    nombre: pacienteHospitalizado.hsunombre || ''
                },
                cama: {
                    ...prevState.cama,
                    codigo: pacienteHospitalizado.hcacodigo || '',
                    nombre: pacienteHospitalizado.hcanombre || ''
                }
            }));
    
            const getMedidasAislamiento = async () => {
                try {
                    const response = await obtenerMedidasAislamiento();
                    setMedidasAislamiento(response);
                } catch (error) {
                    console.error(error);
                }
            }
            getMedidasAislamiento();

            const getBloquesServicio = async () => {
                const response = await obtenerBloquesServicio();
                setBloquesServicio(response);
            }
            getBloquesServicio();

            const getEspecialidades = async () => {
                obtenerEspecialidades()
                .then(response => {
                    setEspecialidades(response);
                }).catch(error => {
                    console.error(error);
                });
            }
            getEspecialidades();
        }
    }, [pacienteHospitalizado]);

    const opcionesMedidas = medidasAislamiento.map(medida => ({ value: medida.id, label: medida.nombre }));
    const opcionesEspecialidades = especialidades.map(especialidad => ({ value: especialidad.id, label: especialidad.titulo }));
    const opcionesBloqueServicio = bloquesServicio.map(bloque => ({ value: bloque.id, label: bloque.nombre }));

    const handleMedidasAislamientoChange = (selectedOptions) => {
        const medidasSeleccionadas = selectedOptions.map(option => ({id: parseInt(option.value)}));
        setForm((prevState) => ({
            ...prevState,
            medidasAislamiento: medidasSeleccionadas
        }));
    };

    const handleBloqueServicioChange = (selectedOption) => {
        
        const bloqueSeleccionado = {id: parseInt(selectedOption.value)};
        
        setForm((prevState) => ({
            ...prevState,
            bloqueServicio: bloqueSeleccionado
        }))
    };

    const handleEspecialidadesChange = (selectedOptions) => {
        const especialidadesSeleccionadas = selectedOptions.map(option => ({id: parseInt(option.value)}));
        setForm((prevState) => ({
            ...prevState,
            titulosFormacionAcademica: especialidadesSeleccionadas
        }));
    };
    
    const handleDiagnosticosChange = (selectedOptions) => {
        setDiagnosticos(selectedOptions);
        setForm((prevState) => ({
            ...prevState,
            diagnosticos: selectedOptions.map(option => ({id: option.value}))
        }));
    }; 

    //realizar petción al servidor para obtener los diagnósticos
    const loadDiagnosticos = (inputValue, callback) => {
        if (!inputValue) {
            return callback([]);
        }
        if (inputValue.length > 3) {
            obtenerDiagnosticos(inputValue)
            .then(response => {
                const options = response.map(diagnostico => ({
                    value: diagnostico.id,
                    label: diagnostico.nombre
                }));
                return callback(options);
            }).catch((error) => {
                console.error(error);
                callback([]);
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await guardarVersionSolicitudCama(form);
            setForm(initialFormState);
            opcionesBloqueServicio.length = 0;
            opcionesEspecialidades.length = 0;
            opcionesMedidas.length = 0;
            handleCloseFormSolicitud();
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Guardado',
            //     text: `Solicitud guardada correctamente`
            // });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.codigoError != undefined) {
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Opss...',
                //     text: `${error.response.data.mensaje.split(',')[1]}`
                // });
            }
            else {
                console.error(error);
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Opss...',
                //     text: `Revisar la consola para más detalles`
                // });
            }            
        }
    };

    return (
        <>
            <Modal show={showFormSolicitud} onHide={handleCloseFormSolicitud} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} id='formulario'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <label htmlFor="Identificacion" className="form-label" > Identificacion </label>
                                <input type="text" id="identificacion" className="form-control" value={form.solicitudCama.ingreso.paciente.documento} disabled={true} />
                                <label htmlFor="Nombres" className="form-label" > Nombre Completo </label>
                                <input type="text" id="Nombres" className="form-control" value={form.solicitudCama.ingreso.paciente.nombreCompleto} disabled={true} />
                                <label htmlFor="Genero" className="form-label">Género </label>
                                <input type="text" id="Genero" className="form-control" value={form.solicitudCama.ingreso.paciente.genero} disabled={true} />
                                <label htmlFor="FechaNacimiento" className="form-label"> Fecha Nacimiento </label>
                                <input type="text" id="FechaNacimiento" className="form-control" value={form.solicitudCama.ingreso.paciente.fechaNacimiento} disabled={true} />
                                <label htmlFor="Entidad" className="form-label"> Entidad </label>
                                <input type="text" id="Entidad" className="form-control" value={pacienteHospitalizado.entidad} disabled={true} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="ingreso" className="form-label"> Ingreso </label>
                                <input type="text" id="Ingreso" className="form-control" value={form.solicitudCama.ingreso.id} disabled={true} />
                                <label htmlFor="fechaIngreso" className="form-label">  Fecha Ingreso</label>
                                <input type="datetime-local" id="fechaIngreso" className="form-control" value={form.solicitudCama.ingreso.fechaIngreso} disabled={true} />
                                <label htmlFor="Servicio" className="form-label">Servicio </label>
                                <input type="text" id="Servicio" className="form-control" value={form.servicio.nombre} disabled={true} />
                                <label htmlFor="Cama" className="form-label"> Cama </label>
                                <input type="text" id="Cama" className="form-control" value={form.cama.nombre} disabled={true} />
                                <label htmlFor="CodigoCama" className="form-label"> Código Cama </label>
                                <input type="text" id="CodigoCama" className="form-control" value={form.cama.codigo} disabled={true} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Requiere Aislamiento</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="aislamiento" id="aislamientoSi" value="si" checked={form.requiereAislamiento === true}
                                            onChange={() => setForm((prevState) => ({
                                                ...prevState,
                                                requiereAislamiento: true
                                            }))} />
                                        <label className="form-check-label" htmlFor="aislamientoSi"> Sí </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="aislamiento" id="aislamientoNo" value="no" checked={form.requiereAislamiento === false}
                                            onChange={() => setForm((prevState) => ({
                                                ...prevState,
                                                requiereAislamiento: false
                                            }))} />
                                        <label className="form-check-label" htmlFor="aislamientoNo"> No </label>
                                    </div>
                                </div>
                                {form.requiereAislamiento && (
                                    <>
                                        <div >
                                            <label className="form-label">Medidas de Aislamiento</label>
                                            <Select isMulti options={opcionesMedidas} className="basic-multi-select" classNamePrefix="select" placeholder="Elige opciones..." onChange={handleMedidasAislamientoChange} />
                                        </div>
                                        <div >
                                            <label htmlFor="motivoAislamiento" className="form-label"> Motivo de Aislamiento </label>
                                            <input type="text" id="motivoAislamiento" className="form-control" placeholder="Escribe el motivo" 
                                                onChange={() => setForm((prevState) => ({
                                                    ...prevState,
                                                    motivo: document.getElementById('motivoAislamiento').value
                                                }))}
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className='form-label'>Bloque que desea trasladar</label>
                                    <Select options={opcionesBloqueServicio} className='basic-single' classNamePrefix='select' placeholder='Elige una opción...' 
                                        onChange={handleBloqueServicioChange}/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Especialidad Tratante</label>
                                <Select isMulti options={opcionesEspecialidades} className="basic-multi-select" classNamePrefix="select" placeholder="Elige opciones..." onChange={handleEspecialidadesChange} />
                                <label htmlFor="RequerimientosEspeciales" className="form-label" > Requerimientos Especiales </label>
                                <input type="text" id="requerimientosespeciales" name='requerimientosEspeciales' className="form-control" placeholder="" required
                                    onChange={() => setForm((prevState) => ({
                                        ...prevState,
                                        requerimientosEspeciales: document.getElementById('requerimientosespeciales').value
                                    }))}
                                />
                                <label className="form-label">Diagnóstico</label>
                                <AsyncSelect isMulti cacheOptions defaultOptions loadOptions={loadDiagnosticos} onChange={handleDiagnosticosChange} value={diagnosticos} placeholder="Escribe para buscar y seleccionar..." required/>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type='submit' form='formulario' >Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
