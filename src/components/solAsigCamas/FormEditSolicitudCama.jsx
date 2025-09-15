import { useEffect, useState } from 'react'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { obtenerBloquesServicio } from '../../api/asignacionCamas/bloqueServicioService';
import { obtenerEspecialidades } from '../../api/asignacionCamas/especialidadService';
import { obtenerMedidasAislamiento } from '../../api/asignacionCamas/medidasAislamientoService';
import { modificarVersionSolicitudCama } from '../../api/asignacionCamas/versionSolicitudCamaService';
import { obtenerDiagnosticos } from '../../api/asignacionCamas/diagnosticoService';

const initialFormState = {
    requiereAislamiento: false,
    motivo: '',
    requerimientosEspeciales: '',
    medidasAislamiento: [ ],
    titulosFormacionAcademica: [],
    diagnosticos: []
  }
export default function FormEditSolicitudCama({versionSolicitudCama, showFormEditSolicitudCama, handleCloseFormEditSolicitudCama, setResponseEditar}) {

    const [form, setForm] = useState(initialFormState);
    const [especialidades, setEspecialidades] = useState([]);
    const [medidasAislamiento, setMedidasAislamiento] = useState([]);
    const [bloquesServicio, setBloquesServicio] = useState([]);

    const [medidasAislamientoSeleccionadas, setMedidasAislamientoSeleccionadas] = useState([]);
    const [bloqueServicioSeleccionado, setBloqueServicioSeleccionado] = useState(null);
    const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([]);
    const [diagnosticosSeleccionados, setDiagnosticosSeleccionados] = useState([]);
    const [btnEditar, setBtnEditar] = useState(true);

    const opcionesMedidas = medidasAislamiento.map(medida => ({ value: medida.id, label: medida.nombre }));
    const opcionesEspecialidades = especialidades.map(especialidad => ({ value: especialidad.id, label: especialidad.titulo }));
    const opcionesBloqueServicio = bloquesServicio.map(bloque => ({ value: bloque.id, label: bloque.nombre }));

    useEffect(() => {
        if(versionSolicitudCama != null){
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
                obtenerBloquesServicio()
                .then(response => {
                    setBloquesServicio(response);
                }).catch(error => {
                    console.error(error);
                });
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
    }, [versionSolicitudCama]);

    useEffect(() => {
        if(versionSolicitudCama != null){
            setMedidasAislamientoSeleccionadas(versionSolicitudCama.medidasAislamiento.map(medida => ({ value: medida.id, label: medida.nombre })));
            setBloqueServicioSeleccionado({ value: versionSolicitudCama.bloqueServicio.id, label: versionSolicitudCama.bloqueServicio.nombre });
            setEspecialidadesSeleccionadas(versionSolicitudCama.titulosFormacionAcademica.map(titulo => ({ value: titulo.id, label: titulo.titulo })));
            setDiagnosticosSeleccionados(versionSolicitudCama.diagnosticos.map(diagnostico => ({ value: diagnostico.id, label: diagnostico.nombre })));
            setForm((prevState) => ({
                ...prevState,
                requiereAislamiento: versionSolicitudCama.requiereAislamiento,
                requerimientosEspeciales: versionSolicitudCama.requerimientosEspeciales,
                motivo: versionSolicitudCama.motivo,
                medidasAislamiento: versionSolicitudCama.medidasAislamiento.map(medida => ({ id: medida.id })),
                bloqueServicio: { id: versionSolicitudCama.bloqueServicio.id },
                titulosFormacionAcademica: versionSolicitudCama.titulosFormacionAcademica.map(titulo => ({ id: titulo.id })),
                diagnosticos: versionSolicitudCama.diagnosticos.map(diagnostico => ({ id: diagnostico.id })),
                
    
                })
            );
        }
    }, [especialidades, medidasAislamiento, bloquesServicio, versionSolicitudCama]);

    useEffect( () => {
        if(versionSolicitudCama != null && form !== initialFormState){
            setBtnEditar(!hasChanges(versionSolicitudCama, form));
        }
    },[form, versionSolicitudCama]);

    function hasChanges(original, updated){
        if (original.requiereAislamiento !== updated.requiereAislamiento) return true;
        if (String(original.motivo).toUpperCase() !== String(updated.motivo).toUpperCase()) return true;
        if (String(original.requerimientosEspeciales).toUpperCase() != String(updated.requerimientosEspeciales).toUpperCase()) return true;

        //comparacion de arrays
        const compareArrays = (arr1, arr2, key ) => {
            if(arr1.length !== arr2.length) return true;
            return arr1.some((item, index) => item[key] !== arr2[index][key]); 
        };

        if(compareArrays(original.medidasAislamiento, updated.medidasAislamiento, 'id')) return true;
        if(compareArrays(original.titulosFormacionAcademica, updated.titulosFormacionAcademica, 'id')) return true;
        if(compareArrays(original.diagnosticos, updated.diagnosticos, 'id')) return true;

        if(original.bloqueServicio?.id !== updated.bloqueServicio.id) return true;

        return false;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target; // Obtén el nombre y el valor del input
        setForm((prevForm) => ({
            ...prevForm, // Copia las propiedades existentes
            [name]: value, // Actualiza solo el campo que cambió
        }));
    };

    const loadDiagnosticos = (inputValue, callback) => {
        if (!inputValue) {
            return callback([]);
        }
        const getDiagnosticos = async (inputValue) => {
            return await obtenerDiagnosticos(inputValue);
        }
        if (inputValue.length > 3) {
            getDiagnosticos(inputValue)
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

    const handleMedidasAislamientoChange = (selectedOptions) => {
        const medidasSeleccionadas = selectedOptions.map(option => ({id: parseInt(option.value)}));
        setForm((prevState) => ({
            ...prevState,
            medidasAislamiento: medidasSeleccionadas
        }));
        setMedidasAislamientoSeleccionadas(selectedOptions);
    };

    const handleBloqueServicioChange = (selectedOption) => {
        const bloqueServicioSeleccionado = { id: selectedOption.value };
        setForm((prevState) => ({
            ...prevState,
            bloqueServicio: bloqueServicioSeleccionado
        }));
        setBloqueServicioSeleccionado(selectedOption);
    };

    const handleEspecialidadesChange = (selectedOptions) => {
        const especialidadesSeleccionadas = selectedOptions.map(option => ({id: parseInt(option.value)}));
        setForm((prevState) => ({
            ...prevState,
            titulosFormacionAcademica: especialidadesSeleccionadas
        }));
        setEspecialidadesSeleccionadas(selectedOptions);
    }

    const handleDiagnosticosChange = (selectedOptions) => {
        setDiagnosticosSeleccionados(selectedOptions);
        setForm((prevState) => ({
            ...prevState,
            diagnosticos: selectedOptions.map(option => ({ id: option.value }))
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await modificarVersionSolicitudCama(versionSolicitudCama.id, form)
        .then(response => {
            handleCloseFormEditSolicitudCama();
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Solicitud de cama actualizada',
            //     showConfirmButton: false,
            //     timer: 1100
            // }).then(() => {
            //     setResponseEditar(response.data);
            // });
            
        }).catch(error => {
            console.error(error);
        });      
        
    }

    return (
        <>
            {versionSolicitudCama != null && <Modal show={showFormEditSolicitudCama} onHide={handleCloseFormEditSolicitudCama} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} id='formulario'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <label htmlFor="Identificacion" className="form-label" > Identificacion </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.solicitudCama.ingreso.paciente.documento} disabled={true} />
                                <label htmlFor="Nombres" className="form-label" > Nombre Completo </label>
                                <input type="text" className="form-control"value={versionSolicitudCama.solicitudCama.ingreso.paciente.nombreCompleto} disabled={true} />
                                <label htmlFor="Genero" className="form-label">Género </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.solicitudCama.ingreso.paciente.genero} disabled={true} />
                                <label htmlFor="FechaNacimiento" className="form-label"> Fecha Nacimiento </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.solicitudCama.ingreso.paciente.fechaNacimiento} disabled={true} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="ingreso" className="form-label"> Ingreso </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.solicitudCama.ingreso.id} disabled={true} />
                                <label htmlFor="fechaIngreso" className="form-label">  Fecha Ingreso</label>
                                <input type="datetime-local" id="fechaIngreso" className="form-control" value={versionSolicitudCama.solicitudCama.ingreso.fechaIngreso} disabled={true} /> 
                                <label htmlFor="Servicio" className="form-label">Servicio </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.servicio.nombre}  disabled={true} />
                                <label htmlFor="Cama" className="form-label"> Cama </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.cama.nombre} disabled={true} />
                                <label htmlFor="CodigoCama" className="form-label"> Código Cama </label>
                                <input type="text" className="form-control" value={versionSolicitudCama.cama.codigo} disabled={true} />
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
                                            <Select isMulti options={opcionesMedidas} className="basic-multi-select"  value={medidasAislamientoSeleccionadas} classNamePrefix="select" placeholder="Elige opciones..." onChange={handleMedidasAislamientoChange} required/>
                                        </div>
                                        <div >
                                            <label htmlFor="motivoAislamiento" className="form-label"> Motivo de Aislamiento </label>
                                            <input type="text" id="motivo" name="motivo" className="form-control" placeholder="Escribe el motivo" value={form.motivo} onChange={handleInputChange} required/>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className='form-label'>Bloque que desea trasladar</label>
                                    <Select options={opcionesBloqueServicio} className='basic-single' classNamePrefix='select' placeholder='Elige una opción...' value={bloqueServicioSeleccionado} onChange={handleBloqueServicioChange} required/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Especialidad Tratante</label>
                                <Select isMulti options={opcionesEspecialidades} className="basic-multi-select" classNamePrefix="select" placeholder="Elige opciones..." value={especialidadesSeleccionadas} onChange={handleEspecialidadesChange} required/>
                                <label htmlFor="RequerimientosEspeciales" className="form-label" > Requerimientos Especiales </label>
                                <input type="text" id="requerimientosEspeciales" name='requerimientosEspeciales' value={form.requerimientosEspeciales} className="form-control" placeholder="" onChange={handleInputChange} required/>
                                <label className="form-label">Diagnóstico</label>
                                <AsyncSelect isMulti cacheOptions defaultOptions value={diagnosticosSeleccionados} placeholder="Escribe para buscar y seleccionar..." loadOptions={loadDiagnosticos} onChange={handleDiagnosticosChange} required/>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    {!btnEditar && <Button variant="primary" type='submit' form='formulario' >Guardar</Button> }
                    
                </Modal.Footer>
            </Modal>}
        </>
    )
}
