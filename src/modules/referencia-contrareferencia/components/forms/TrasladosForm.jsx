import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faPlus, faMagnifyingGlass, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { guardarTraslado, actualizarTraslado, verificarDuplicadoTraslado } from '../../../referencia-contrareferencia/api/trasladosService';
import { obtenerInformacionCompletaPaciente } from '../../../../modules/dinamica/api/genPacienService';
import Loader from '../../../../shared/components/Loader';
import Modal from '../../../../shared/components/Modal';

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-gray-500";

export default function TrasladosForm({ traslado, onSaved }) {

    const [dataUsuario, setDatausuario] = useState(null);

    const [formData, setFormData] = useState({
        fechaTraslado: '',
        nomPaciente: '',
        documento: '',
        ingreso: '',
        eps: '',
        tipoTraslado: '',
        servicio: '',
        destino: '',
        ciudad: '',
        autorizacion: '',
        auxiliarReferencia: '',
        auxiliarAmbulancia: '',
        medicamentos: [],
        archivo: '',
        estado: '',
        observaciones: ''
    });
    const [medicamentosTexto, setMedicamentosTexto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDuplicadoModal, setShowDuplicadoModal] = useState(false);
    const [duplicadoData, setDuplicadoData] = useState(null);
    const [pendingAction, setPendingAction] = useState(null); // 'guardar' | 'actualizar'

    useEffect(() => {
        if (traslado) {
            setFormData({
                fechaTraslado: traslado.fechaTraslado?.slice(0, 16) || '',
                nomPaciente: traslado.nomPaciente || '',
                documento: traslado.documento || '',
                ingreso: traslado.ingreso || '',
                eps: traslado.eps || '',
                tipoTraslado: traslado.tipoTraslado || '',
                servicio: traslado.servicio || '',
                destino: traslado.destino || '',
                ciudad: traslado.ciudad || '',
                autorizacion: traslado.autorizacion || '',
                auxiliarReferencia: traslado.auxiliarReferencia || '',
                auxiliarAmbulancia: traslado.auxiliarAmbulancia || '',
                medicamentos: traslado.medicamentos || [],
                archivo: traslado.archivo || '',
                estado: traslado.estado || '',
                observaciones: traslado.observaciones || ''
            });
            setMedicamentosTexto((traslado.medicamentos || []).join(', '));
        } else {
            const now = new Date();
            const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
            setFormData({
                fechaTraslado: local.toISOString().slice(0, 16),
                nomPaciente: '',
                documento: '',
                ingreso: '',
                eps: '',
                tipoTraslado: '',
                servicio: '',
                destino: '',
                ciudad: '',
                autorizacion: '',
                auxiliarReferencia: '',
                auxiliarAmbulancia: '',
                archivo: '',
                observaciones: '',
                estado: 'PENDIENTE'
            });
            setMedicamentosTexto('');
        }
    }, [traslado]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar payload para verificar duplicados
        const payload = {
            ...formData,
            medicamentos: medicamentosTexto
                .split(',')
                .map(m => m.trim())
                .filter(Boolean)
        };

        // Verificar duplicado antes de guardar (solo en creación, no en edición)
        if (!traslado) {
            setLoading(true);
            try {
                const duplicado = await verificarDuplicadoTraslado(payload);
                if (duplicado) {
                    // Hay duplicado - mostrar modal de confirmación
                    setDuplicadoData(duplicado);
                    setPendingAction('guardar');
                    setShowDuplicadoModal(true);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error('Error al verificar duplicado:', err);
                // Si falla la verificación, continuamos con el guardado
            }
        }

        // Si no hay duplicado o es edición, proceder a guardar
        await ejecutarGuardado(payload);
    };

    const ejecutarGuardado = async (payload, force = false) => {
        setLoading(true);
        setError('');

        try {
            if (traslado) {
                await actualizarTraslado(traslado.id, payload);
            } else {
                await guardarTraslado(payload, force);
            }

            onSaved && onSaved();
            setShowDuplicadoModal(false);
            setDuplicadoData(null);
            setPendingAction(null);
        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrio un error al guardar el traslado.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDuplicado = () => {
        if (pendingAction === 'guardar') {
            const payload = {
                ...formData,
                medicamentos: medicamentosTexto
                    .split(',')
                    .map(m => m.trim())
                    .filter(Boolean)
            };
            ejecutarGuardado(payload, true);
        }
    };

    const handleCancelDuplicado = () => {
        setShowDuplicadoModal(false);
        setDuplicadoData(null);
        setPendingAction(null);
    };

    const buscarPaciente = async (ingreso) => {
        if (ingreso.length < 3) return;
        setDatausuario(null);
        setLoading(true);

        try {
            const respuesta = await obtenerInformacionCompletaPaciente(ingreso);
            setDatausuario(respuesta);
        } catch (error) {
            manejarConfirmacion(ingreso);
        }
        setLoading(false);
    };

    const manejarConfirmacion = async (ingreso) => {
        const confirmar = window.confirm("El paciente no tiene ingreso activo. ¿Desea continuar con el traslado con esta información?");

        if (!confirmar) {
            handleChange('ingreso', '');
        }
    };

    useEffect(() => {
        if (dataUsuario && !traslado) {  //actualizar si NO es edición
            handleChange('documento', dataUsuario.pacNumDoc || '');
            handleChange('ingreso', dataUsuario?.ingreso || '');
            handleChange('eps', dataUsuario?.entidad || '');
            handleChange('servicio', dataUsuario?.servicio || '');
            handleChange('nomPaciente', dataUsuario?.nombreCompleto || '');
        }
    }, [dataUsuario, traslado]);

    return (
        <>
            <div className="bg-white shadow-md rounded-lg p-2 mb-2">
                {loading && (<Loader />)}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-2 gap-2">

                    {/* ── SECCIÓN: Buscar paciente ── */}
                    <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm w-4 h-4 text-black" /> Buscar paciente por Documento
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Documento</label>
                        <input type="text" value={formData.documento}
                            onChange={e => handleChange('documento', e.target.value)}
                            placeholder="Ej: 1061234567"
                            readOnly={!!traslado}
                            onBlur={e => buscarPaciente(e.target.value)}
                            className={traslado ? INPUT_READONLY : INPUT_CLASS}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Paciente
                        </label>
                        <input type="text" value={formData.nomPaciente}
                            onChange={e => handleChange('nomPaciente', e.target.value)}
                            readOnly={dataUsuario?.nombreCompleto ? true : false}
                            className={dataUsuario?.nombreCompleto ? INPUT_READONLY : INPUT_CLASS}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Ingreso </label>
                        <input type="text"
                            value={formData.ingreso}
                            onChange={e => handleChange('ingreso', e.target.value)}
                            // Solo editable al crear, bloqueado al editar
                            readOnly={dataUsuario ? true : false}
                            className={dataUsuario ? INPUT_READONLY : INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">EPS</label>
                        <input type="text"
                            value={formData.eps}
                            onChange={e => handleChange('eps', e.target.value)}
                            //className={INPUT_CLASS}
                            readOnly={dataUsuario?.entidad ? true : false}
                            className={dataUsuario?.entidad ? INPUT_READONLY : INPUT_CLASS}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                        <input type="text"
                            value={formData.servicio}
                            onChange={e => handleChange('servicio', e.target.value)}
                            //className={INPUT_CLASS}
                            readOnly={dataUsuario ? true : false}
                            className={dataUsuario ? INPUT_READONLY : INPUT_CLASS}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Fecha traslado</label>
                        <input type="datetime-local"
                            value={formData.fechaTraslado}
                            onChange={e => handleChange('fechaTraslado', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Tipo traslado </label>
                        <select value={formData.tipoTraslado}
                            onChange={e => handleChange('tipoTraslado', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required >
                            <option value="">-- Seleccionar --</option>
                            <option value="TBS">TBS</option>
                            <option value="TBR">TBR</option>
                            <option value="TMS">TMS</option>
                            <option value="TMR">TMR</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destino
                        </label>
                        <input type="text" value={formData.destino}
                            onChange={e => handleChange('destino', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Ciudad </label>
                        <input type="text"
                            value={formData.ciudad}
                            onChange={e => handleChange('ciudad', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Autorización </label>
                        <textarea rows={2}
                            value={formData.autorizacion}
                            onChange={e => handleChange('autorizacion', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auxiliar referencia</label>
                        <select value={formData.auxiliarReferencia}
                            onChange={e => handleChange('auxiliarReferencia', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">-- Seleccionar --</option>
                            <option value="MAILY BASTIDAS">MAILY BASTIDAS</option>
                            <option value="PAOLA ORTIZ">PAOLA ORTIZ</option>
                            <option value="DANIELA GALINDO">DANIELA GALINDO</option>
                            <option value="XIMENA ORDOÑEZ">XIMENA ORDOÑEZ</option>
                            <option value="SANDRA MORCILLO">SANDRA MORCILLO</option>
                            <option value="ALEXIS HOYOS">ALEXIS HOYOS</option>
                            <option value="ADRIANA MANCHOLA">ADRIANA MANCHOLA</option>
                            <option value="VIVIANA RUBIO">VIVIANA RUBIO</option>
                            <option value="DEIVY CASTILLO">DEIVY CASTILLO</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Auxiliar ambulancia </label>
                        <select value={formData.auxiliarAmbulancia}
                            onChange={e => handleChange('auxiliarAmbulancia', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">-- Seleccionar --</option>
                            <option value="MAURICIO MACIAS">MAURICIO MACIAS</option>
                            <option value="STEVEN SARRIA">STEVEN SARRIA</option>
                            <option value="NATALIA BASTIDAS">NATALIA BASTIDAS</option>
                            <option value="VIVIANA SANCHEZ">VIVIANA SANCHEZ</option>
                            <option value="LORENA RIVERA">LORENA RIVERA</option>
                            <option value="YENNY CAMAYO COMETA">YENNY CAMAYO COMETA</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medicamentos (separados por coma)
                        </label>
                        <input type="text"
                            value={medicamentosTexto}
                            onChange={e => setMedicamentosTexto(e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Paracetamol 1g IV, Omeprazol 40mg..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Archivo</label>
                        <select value={formData.archivo}
                            onChange={e => handleChange('archivo', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required >
                            <option value="">-- Seleccionar --</option>
                            <option value="REFERENCIA_Y_SOLICITUDES">REFERENCIA Y SOLICITUDES</option>
                            <option value="CONSULTAR_ARCHIVOS_ADJUNTOS">CONSULTAR ARCHIVOS ADJUNTOS</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Observación </label>
                        <textarea rows={2}
                            value={formData.observaciones}
                            onChange={e => handleChange('observaciones', e.target.value)}
                            className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                        <button type="submit" disabled={loading}
                            className="px-2 py-2 bg-green-600 text-white font-semibold text-md rounded hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full lg:w-auto">
                            {loading ? 'Guardando...' : (traslado ? <span><FontAwesomeIcon icon={faArrowsRotate} className="w-4 h-4 text-white pr-2" />Actualizar</span> : <span><FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white pr-2" />Crear</span>)}
                        </button>
                    </div>
                </form>
            </div>

            {showDuplicadoModal && duplicadoData && (
                <Modal
                    isOpen={showDuplicadoModal}
                    onClose={handleCancelDuplicado}
                    title="Traslado duplicado detectado"
                    size="md"
                >
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-semibold mb-2">Ya existe un traslado con esa información</p>
                                <p className="mb-2">Verifique si la fecha del traslado es diferente para no generar duplicados.</p>
                                <p className="font-medium">¿Desea continuar y crear el traslado?</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <p><span className="font-medium">Paciente:</span> {duplicadoData.nomPaciente}</p>
                            <p><span className="font-medium">Documento:</span> {duplicadoData.documento}</p>
                            <p><span className="font-medium">Ingreso:</span> {duplicadoData.ingreso || 'N/A'}</p>
                            <p><span className="font-medium">EPS:</span> {duplicadoData.eps}</p>
                            <p><span className="font-medium">Tipo traslado:</span> {duplicadoData.tipoTraslado}</p>
                            <p><span className="font-medium">Servicio:</span> {duplicadoData.servicio}</p>
                            <p><span className="font-medium">Destino:</span> {duplicadoData.destino}</p>
                            <p><span className="font-medium">Ciudad:</span> {duplicadoData.ciudad}</p>
                            <p><span className="font-medium">Fecha existente:</span> {duplicadoData.fechaTraslado ? new Date(duplicadoData.fechaTraslado).toLocaleString() : 'N/A'}</p>
                            <p><span className="font-medium">Fecha a registrar:</span> {formData.fechaTraslado ? new Date(formData.fechaTraslado).toLocaleString() : 'N/A'}</p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                onClick={handleCancelDuplicado}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDuplicado}
                                disabled={loading}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                            >
                                {loading ? 'Guardando...' : 'Aceptar y continuar'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
