import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faFile, faFileEdit, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { guardarFactura, actualizarFactura } from '../../../api/referenciaContrareferencia/facturacionService';
import { obtenerTraslados, obtenerTrasladoPorId } from '../../../api/referenciaContrareferencia/trasladosService';
const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-gray-500";

export default function FacturacionForm({ facturacion, onSaved }) {

    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;


    const [formData, setFormData] = useState({
        trasladoId: '',
        fechaPrefactura: '',
        prefactura: '',
        produccion: '',
        fechaFactura: '',
        factura: '',
        valor: '',
        nombreFacturador: usuario?.name_user || ''
    });

    // Datos del traslado (solo lectura, para referencia visual)
    const [infoTraslado, setInfoTraslado] = useState({
        nomPaciente: '',
        ingreso: '',
        eps: ''
    });

    const [documento, setDocumento] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const buscarPorTrasladoId = async (trasladoId) => {
        if (!trasladoId) return;
        try {
            const traslado = await obtenerTrasladoPorId(trasladoId);
            setInfoTraslado({
                nomPaciente: traslado.nomPaciente || '',
                ingreso: traslado.ingreso || '',
                eps: traslado.eps || ''
            });
            setDocumento(traslado.documento || '');
        } catch (err) {
            const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
            setError('Error al cargar datos del traslado: ' + (backendMessage || err.message));
        }
    };

    // Busca en la tabla traslados por documento
    const buscarPorDocumento = async (doc) => {
        if (doc.length < 5) return;
        setBuscando(true);
        setError('');
        try {
            const lista = await obtenerTraslados();

            // Busca el traslado más reciente con ese documento
            const encontrado = lista
                .filter(t => t.documento === doc)
                .sort((a, b) => new Date(b.fechaTraslado) - new Date(a.fechaTraslado))[0];

            if (encontrado) {
                setInfoTraslado({
                    nomPaciente: encontrado.nomPaciente || '',
                    ingreso: encontrado.ingreso || '',
                    eps: encontrado.eps || ''
                });
                handleChange('trasladoId', encontrado.id);
            } else {
                setInfoTraslado({ nomPaciente: '', ingreso: '', eps: '' });
                handleChange('trasladoId', '');
                setError(`No se encontró ningún traslado con documento: ${doc}`);
            }
        } catch (err) {
            const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
            setError('Error al buscar: ' + (backendMessage || err.message));
        } finally {
            setBuscando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.trasladoId) {
            setError('Debes buscar un paciente válido antes de guardar');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                trasladoId: Number(formData.trasladoId),
                valor: Number(formData.valor)
            };

            if (facturacion) {
                await actualizarFactura(facturacion.id, payload);
            } else {
                await guardarFactura(payload);
            }

            onSaved && onSaved();
        } catch (err) {
            const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrio un error al guardar la factura.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (facturacion) {
            setFormData({
                trasladoId: facturacion.trasladoId || '',
                fechaPrefactura: facturacion.fechaPrefactura?.slice(0, 16) || '',
                prefactura: facturacion.prefactura || '',
                produccion: facturacion.produccion || '',
                fechaFactura: facturacion.fechaFactura?.slice(0, 16) || '',
                factura: facturacion.factura || '',
                valor: facturacion.valor || '',
                nombreFacturador: facturacion.nombreFacturador || ''
            });
            // ✅ Carga automática de datos del traslado al editar
            buscarPorTrasladoId(facturacion.trasladoId);
        } else {
            const now = new Date();
            const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setFormData({
                trasladoId: '',
                fechaPrefactura: local,
                prefactura: '',
                produccion: '',
                fechaFactura: local,
                factura: '',
                valor: '',
                nombreFacturador: usuario?.name_user || ''
            });
            setInfoTraslado({ nomPaciente: '', ingreso: '', eps: '' });
            setDocumento('');
        }
    }, [facturacion]);



    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-2">

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-2 gap-3">

                {/* ── SECCIÓN: Buscar paciente ── */}
                <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm w-4 h-4 text-black" /> Buscar paciente por documento
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento
                    </label>
                    <input
                        type="text"
                        value={documento}
                        onChange={e => setDocumento(e.target.value)}
                        onBlur={e => buscarPorDocumento(e.target.value)}
                        placeholder="Ej: 1061234567"
                        // Solo editable al crear, bloqueado al editar
                        readOnly={!!facturacion}
                        className={facturacion ? INPUT_READONLY : INPUT_CLASS}
                        required
                    />
                    {buscando && <p className="text-xs text-blue-500 mt-1">Buscando...</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Traslado
                    </label>
                    <input
                        type="text"
                        value={formData.trasladoId}
                        readOnly
                        className={INPUT_READONLY}
                    />
                </div>

                {/* Datos del traslado - solo lectura */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paciente
                    </label>
                    <input
                        type="text"
                        value={infoTraslado.nomPaciente}
                        readOnly
                        className={INPUT_READONLY}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingreso
                    </label>
                    <input
                        type="text"
                        value={infoTraslado.ingreso}
                        readOnly
                        className={INPUT_READONLY}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        EPS
                    </label>
                    <input
                        type="text"
                        value={infoTraslado.eps}
                        readOnly
                        className={INPUT_READONLY}
                        required
                    />
                </div>

                {/* ── SECCIÓN: Datos de facturación ── */}
                <div className="col-span-2 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <FontAwesomeIcon icon={faFile} className="text-sm w-4 h-4 " /> Datos de facturación
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha prefactura
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.fechaPrefactura}
                        onChange={e => handleChange('fechaPrefactura', e.target.value)}
                        className={INPUT_CLASS}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prefactura
                    </label>
                    <input
                        type="text"
                        value={formData.prefactura}
                        onChange={e => handleChange('prefactura', e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Producción
                    </label>
                    <input
                        type="text"
                        value={formData.produccion}
                        onChange={e => handleChange('produccion', e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha factura
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.fechaFactura}
                        onChange={e => handleChange('fechaFactura', e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Factura
                    </label>
                    <input
                        type="text"
                        value={formData.factura}
                        onChange={e => handleChange('factura', e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.valor}
                        onChange={e => handleChange('valor', e.target.value)}
                        className={INPUT_CLASS}
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre facturador
                    </label>
                    <div className={INPUT_READONLY + ' ' + INPUT_CLASS}>
                        {formData.nombreFacturador || ''}
                    </div>
                </div>

                <div className="col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        {loading ? 'Guardando...' : (
                            facturacion
                                ? <span><FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />Actualizar</span>
                                : <span><FontAwesomeIcon icon={faPlus} className="mr-2" />Crear</span>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
