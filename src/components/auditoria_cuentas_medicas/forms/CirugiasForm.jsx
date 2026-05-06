import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faSave } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { actualizarCirugia } from '../../../api/auditoria_cuentas_medicas/cirugiasService';
import { toast } from 'react-toastify';

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-gray-500";
const SELECT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

const OPCIONES_AUTORIZACION = ['', 'Sí', 'No', 'Pendiente'];
const OPCIONES_ESTADO = ['', 'Pendiente', 'Hecho', 'Ok', 'No facturable', 'Adición', 'Nulo', 'Facturable', 'Revisión', 'Hecho pendiente', 'Adición pendiente'];

export default function CirugiasForm({ cirugia, onSaved }) {
    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;

    const obtenerNombreUsuario = () => {
        const token = localStorage.getItem('tokenhusjp');
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.nombre || payload.sub || payload.userName || '';
        } catch {
            return '';
        }
    };

    const [formData, setFormData] = useState({
        tipoProcedimiento: '',
        pacienteNumeroIdentificacion: '',
        ingresoNumero: '',
        cupsCodigo: '',
        procedCod: '',
        gqx: '',
        intervencion: '',
        especialidadNombre: '',
        medicoNombre: '',
        anestesiologoNombre: '',
        ayudante1: '',
        ayudante2: '',
        liquidacion: '',
        novedadDesc: '',
        autorizacion: '',
        imagenesDx: '',
        estadoAuditoria: '',
        causaObjecion: '',
        revSupervision: '',
        fechaSolicitud: '',
        fechaCargue: '',
        horaCargue: '',
        fechaResultado: '',
        entidadSaludNombre: '',
        regimen: '',
        observacionAuditoria: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await actualizarCirugia(cirugia.id, formData);
            toast.success('Procedimiento actualizado correctamente');
            onSaved && onSaved();
        } catch (err) {
            setError(err.message);
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cirugia) {
            setFormData({
                tipoProcedimiento: cirugia.tipoProcedimiento || '',
                pacienteNumeroIdentificacion: cirugia.pacienteNumeroIdentificacion || '',
                ingresoNumero: cirugia.ingresoNumero || '',
                cupsCodigo: cirugia.cupsCodigo || '',
                procedCod: cirugia.procedCod || '',
                gqx: cirugia.gqx || '',
                intervencion: cirugia.intervencion || '',
                especialidadNombre: cirugia.especialidadNombre || '',
                medicoNombre: cirugia.medicoNombre || '',
                anestesiologoNombre: cirugia.anestesiologoNombre || '',
                ayudante1: cirugia.ayudante1 || '',
                ayudante2: cirugia.ayudante2 || '',
                liquidacion: cirugia.liquidacion || '',
                novedadDesc: cirugia.novedadDesc || '',
                autorizacion: cirugia.autorizacion || '',
                imagenesDx: cirugia.imagenesDx || '',
                estadoAuditoria: cirugia.estadoAuditoria || '',
                causaObjecion: cirugia.causaObjecion || '',
                revSupervision: cirugia.revSupervision || '',
                fechaSolicitud: cirugia.fechaSolicitud || '',
                fechaCargue: cirugia.fechaCargue || '',
                horaCargue: cirugia.horaCargue || '',
                fechaResultado: cirugia.fechaResultado || '',
                entidadSaludNombre: cirugia.entidadSaludNombre || '',
                regimen: cirugia.regimen || '',
                observacionAuditoria: cirugia.observacionAuditoria || ''
            });
        }
    }, [cirugia]);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-2">
            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="col-span-2 mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <FontAwesomeIcon icon={faFile} className="text-sm w-4 h-4 mr-2" />
                        Datos del Procedimiento
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <input type="text" value={formData.tipoProcedimiento} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                        <input type="text" value={formData.pacienteNumeroIdentificacion} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso</label>
                        <input type="text" value={formData.ingresoNumero} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cups</label>
                        <input type="text" value={formData.cupsCodigo} onChange={e => handleChange('cupsCodigo', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proced.Cod</label>
                        <input type="text" value={formData.procedCod} onChange={e => handleChange('procedCod', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GQX</label>
                        <input type="text" value={formData.gqx} onChange={e => handleChange('gqx', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intervención</label>
                        <input type="text" value={formData.intervencion} onChange={e => handleChange('intervencion', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                        <input type="text" value={formData.especialidadNombre} onChange={e => handleChange('especialidadNombre', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                        <input type="text" value={formData.medicoNombre} onChange={e => handleChange('medicoNombre', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Anestesiólogo</label>
                         <input type="text" value={formData.anestesiologoNombre} onChange={e => handleChange('anestesiologoNombre', e.target.value)} className={INPUT_CLASS} />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Ayudante 1</label>
                         <input type="text" value={formData.ayudante1} onChange={e => handleChange('ayudante1', e.target.value)} className={INPUT_CLASS} />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Ayudante 2</label>
                         <input type="text" value={formData.ayudante2} onChange={e => handleChange('ayudante2', e.target.value)} className={INPUT_CLASS} />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
                        <input type="text" value={formData.entidadSaludNombre} onChange={e => handleChange('entidadSaludNombre', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Régimen</label>
                        <input type="text" value={formData.regimen} onChange={e => handleChange('regimen', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Solicitud</label>
                        <input type="text" value={formData.fechaSolicitud} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Cargue</label>
                        <input type="text" value={formData.fechaCargue} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora Cargue</label>
                        <input type="text" value={formData.horaCargue} readOnly className={INPUT_READONLY} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Liquidación</label>
                        <input type="text" value={formData.liquidacion} onChange={e => {
                            handleChange('liquidacion', e.target.value);
                            if (e.target.value) handleChange('revSupervision', obtenerNombreUsuario());
                        }} className={INPUT_CLASS} placeholder="100%, 75%, 50%, 0%, etc." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Novedad</label>
                        <input type="text" value={formData.novedadDesc} onChange={e => handleChange('novedadDesc', e.target.value)} className={INPUT_CLASS} placeholder="cx, anes, ayud, etc." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Autorización</label>
                        <select value={formData.autorizacion} onChange={e => handleChange('autorizacion', e.target.value)} className={SELECT_CLASS}>
                            {OPCIONES_AUTORIZACION.map(op => <option key={op} value={op}>{op || 'Seleccionar'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Dx</label>
                        <input type="text" value={formData.imagenesDx} onChange={e => handleChange('imagenesDx', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select value={formData.estadoAuditoria} onChange={e => handleChange('estadoAuditoria', e.target.value)} className={SELECT_CLASS}>
                            {OPCIONES_ESTADO.map(op => <option key={op} value={op}>{op || 'Seleccionar'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Causa Objeción</label>
                        <input type="text" value={formData.causaObjecion} onChange={e => handleChange('causaObjecion', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rev Supervision</label>
                        <input type="text" value={formData.revSupervision} readOnly className={INPUT_READONLY} />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observación Auditoría</label>
                        <textarea rows={3} value={formData.observacionAuditoria} onChange={e => handleChange('observacionAuditoria', e.target.value)} className={INPUT_CLASS} />
                    </div>
                </div>

                <div className="col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : <><FontAwesomeIcon icon={faSave} className="mr-2" />Actualizar</>}
                    </button>
                </div>
            </form>
        </div>
    );
}