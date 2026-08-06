import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSearch, faCalendarAlt, faDatabase, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { useEffect, useState, useCallback, useRef } from 'react';
import Pagination from '../../Pagination';
import { importarCirugias, obtenerCirugiasPageable, actualizarCirugia, duplicarCirugia, exportarCirugias } from '../../../api/auditoria_cuentas_medicas/cirugiasService';
import { obtenerEntidadesSalud } from '../../../api/auditoria_cuentas_medicas/entidadesService';
import { obtenerEspecialidades } from '../../../api/auditoria_cuentas_medicas/especialidadesService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PAGE_SIZE = 50;

const toDateOnly = (datetime) => {
    if (!datetime) return null;
    return datetime.split('T')[0];
};
const toDatetimeStr = (fecha, hora) => {
    if (!fecha) return null;
    if (!hora) return fecha;
    return `${fecha}T${hora}`;
};

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-500";
const INPUT_INLINE = "border border-blue-400 bg-white px-1 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
const SELECT_INLINE = "border border-blue-400 bg-white px-1 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

const OPCIONES_AUTORIZACION = ['', 'Sí', 'No', 'Pendiente'];
const OPCIONES_ESTADO = ['', 'Pendiente', 'Hecho', 'Ok', 'No facturable', 'Adición', 'Nulo', 'Facturable', 'Revisión', 'Hecho pendiente', 'Adición pendiente', 'Cambio'];

export default function CirugiasTable({ onEdit = () => { }, reloadFlag }) {
    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [fontSize, setFontSize] = useState(10);

    const [fechaInicio, setFechaInicio] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [importando, setImportando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEntidades, setFiltroEntidades] = useState([]);
    const [showEntidadDropdown, setShowEntidadDropdown] = useState(false);
    const entidadDropdownRef = useRef(null);
    const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
    const [entidades, setEntidades] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});

    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize(prev => Math.max(prev - 1, 8));

    const obtenerNombreUsuario = () => usuario?.name_user || '';

    const validarFechas = (mesesMax) => {
        if (!fechaInicio || !fechaFin) {
            toast.error('Debes seleccionar fecha de inicio y fecha fin');
            return false;
        }
        const inicio = new Date(toDatetimeStr(fechaInicio, horaInicio));
        const fin = new Date(toDatetimeStr(fechaFin, horaFin));
        const diffMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
        if (diffMeses > mesesMax) {
            toast.error(`El rango máximo permitido es de ${mesesMax} mes${mesesMax > 1 ? 'es' : ''}`);
            return false;
        }
        if (fin < inicio) {
            toast.error('La fecha fin debe ser mayor o igual a la fecha inicio');
            return false;
        }
        return true;
    };

    const loadData = async (pagina = page) => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCirugiasPageable(toDatetimeStr(fechaInicio, horaInicio), toDatetimeStr(fechaFin, horaFin), busqueda || null, filtroTipo || null, filtroEntidades, filtroEspecialidad || null, pagina, PAGE_SIZE);
            setData(response.contenido || []);
            setTotalPages(response.totalPaginas || 0);
            setTotalElementos(response.totalElementos || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadDataSinFiltro = async (pagina = 0) => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCirugiasPageable(null, null, busqueda || null, filtroTipo || null, filtroEntidades, filtroEspecialidad || null, pagina, PAGE_SIZE);
            setData(response.contenido || []);
            setTotalPages(response.totalPaginas || 0);
            setTotalElementos(response.totalElementos || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!validarFechas(3)) return;
        setBuscando(true);
        setPage(0);
        await loadData(0);
        setBuscando(false);
    };

    const handleImportar = async (e) => {
        e.preventDefault();
        if (!validarFechas(1)) return;

        setImportando(true);
        setError('');
        setImportResult(null);

        try {
            const result = await importarCirugias(toDatetimeStr(fechaInicio, horaInicio), toDatetimeStr(fechaFin, horaFin));
            setImportResult(result);
            setPage(0);
            await loadDataSinFiltro(0);
            toast.success('Importación completada');
        } catch (err) {
            setError(err.message);
            toast.error('Error en la importación');
        } finally {
            setImportando(false);
        }
    };

    const startEdit = useCallback((id, row) => {
        setEditId(id);
        setEditData({
            liquidacion: row.liquidacion || '',
            novedadDesc: row.novedadDesc || '',
            autorizacion: row.autorizacion || '',
            observacionesAutorizacion: row.observacionesAutorizacion || '',
            imagenesDx: row.imagenesDx || '',
            estadoAuditoria: row.estadoAuditoria || '',
            causaObjecion: row.causaObjecion || '',
        });
    }, []);

    const cancelEdit = useCallback(() => {
        setEditId(null);
        setEditData({});
    }, []);

    const updateCell = useCallback((campo, valor) => {
        setEditData(prev => {
            const nuevo = { ...prev, [campo]: valor };
            if (campo === 'liquidacion' && valor) {
                nuevo.revSupervision = obtenerNombreUsuario();
            }
            return nuevo;
        });
    }, []);

    const saveEdit = useCallback(async (id) => {
        if (!editId) return;
        try {
            const payload = {
                liquidacion: editData.liquidacion,
                novedadDesc: editData.novedadDesc,
                autorizacion: editData.autorizacion,
                observacionesAutorizacion: editData.observacionesAutorizacion,
                imagenesDx: editData.imagenesDx,
                estadoAuditoria: editData.estadoAuditoria,
                causaObjecion: editData.causaObjecion,
            };
            if (editData.revSupervision) {
                payload.revSupervision = editData.revSupervision;
            }

            const esCambio = editData.estadoAuditoria === 'Cambio';
            if (esCambio) {
                const confirmado = window.confirm('¿Está seguro de marcar como Cambio? Se actualizará el registro y se creará un duplicado con estado Pendiente Cambio.');
                if (!confirmado) {
                    cancelEdit();
                    return;
                }
                payload.estadoAuditoria = `Cambio-${id}`;
            }

            await actualizarCirugia(id, payload);

            if (esCambio) {
                await duplicarCirugia(id, { ...payload, estadoAuditoria: `Pendiente Cambio-${id}` });
                toast.success('Registro actualizado y duplicado creado');
            } else {
                toast.success('Registro actualizado');
            }

            cancelEdit();
            await loadDataSinFiltro(page);
        } catch (err) {
            toast.error('Error al actualizar: ' + err.message);
        }
    }, [editId, editData, page]);

    const handleKeyDown = useCallback((e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit(id);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    }, [saveEdit, cancelEdit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadData(newPage);
    };

    const handleBusquedaSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        loadData(0);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPage(0);
        loadData(0);
    };

    const handleExportarExcel = async () => {
        const headers = ['ID', 'Tipo', 'Paciente', 'Ingreso', 'Cups', 'Proced.Cod', 'Intervención', 'Especialidad', 'Médico', 'Fecha Cargue', 'Hora Cargue', 'Entidad', 'GQX', 'Anestesiólogo', 'Ayudante 1', 'Ayudante 2', 'Liquidación', 'Novedad', 'Autorización', 'Obs. Autorización', 'Imágenes Dx', 'Estado', 'Causa Objeción', 'Rev Supervision', 'Observación'];

        let datosExportar;
        if (fechaInicio && fechaFin) {
            try {
                datosExportar = await exportarCirugias(toDateOnly(fechaInicio), toDateOnly(fechaFin));
            } catch (err) {
                toast.error('Error al obtener datos para exportar');
                return;
            }
        } else {
            datosExportar = data;
        }

        const filas = datosExportar.map(t => [
            t.id,
            t.tipoProcedimiento,
            t.pacienteNumeroIdentificacion,
            t.ingresoNumero,
            t.cupsCodigo,
            t.procedCod,
            t.intervencion,
            t.especialidadNombre,
            t.medicoNombre,
            t.fechaCargue,
            t.horaCargue,
            t.entidadSaludNombre,
            t.gqx,
            t.anestesiologoNombre,
            t.ayudante1,
            t.ayudante2,
            t.liquidacion,
            t.novedadDesc,
            t.autorizacion,
            t.observacionesAutorizacion,
            t.imagenesDx,
            t.estadoAuditoria,
            t.causaObjecion,
            t.revSupervision,
            t.observacionAuditoria
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...filas]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cirugias');

        const fecha = new Date().toISOString().slice(0, 10);
        const sufijo = fechaInicio && fechaFin ? `_${fechaInicio}_${fechaFin}` : '';
        XLSX.writeFile(wb, `cirugias${sufijo}_${fecha}.xlsx`);
    };

    useEffect(() => {
        setPage(0);
    }, [filtroTipo, filtroEntidades, filtroEspecialidad]);

    useEffect(() => {
        loadData(0);
    }, [filtroTipo, filtroEntidades, filtroEspecialidad]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (entidadDropdownRef.current && !entidadDropdownRef.current.contains(event.target)) {
                setShowEntidadDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const cargarEntidades = async () => {
            try {
                const lista = await obtenerEntidadesSalud();
                setEntidades(lista.filter(e => e.estado === true));
            } catch (err) {
                console.error('Error al cargar entidades:', err);
            }
        };
        cargarEntidades();
        const cargarEspecialidades = async () => {
            try {
                const lista = await obtenerEspecialidades();
                setEspecialidades(lista.filter(e => e.estado === true));
            } catch (err) {
                console.error('Error al cargar especialidades:', err);
            }
        };
        cargarEspecialidades();
    }, []);

    useEffect(() => { loadDataSinFiltro(page); }, [reloadFlag]);

    if (loading) return <p className="text-center py-4">Cargando...</p>;
    if (error) return <p className="text-red-600 text-center py-4">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2 w-full max-w-none">
            <form onSubmit={handleBuscar} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            Fecha/Hora Inicio
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            className={INPUT_CLASS}
                            required
                        />
                        <select value={horaInicio.split(':')[0] || ''} onChange={e => setHoraInicio(e.target.value + ':' + (horaInicio.split(':')[1] || '00'))} className={INPUT_CLASS + " w-20"}>
                        <option value="">HH</option>
                        {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-lg font-bold px-0.5">:</span>
                    <select value={horaInicio.split(':')[1] || ''} onChange={e => setHoraInicio((horaInicio.split(':')[0] || '00') + ':' + e.target.value)} className={INPUT_CLASS + " w-20"}>
                        <option value="">MM</option>
                        {Array.from({length: 12}, (_, i) => String(i * 5).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            Fecha/Hora Fin
                        </label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                            className={INPUT_CLASS}
                            required
                        />
                        <select value={horaFin.split(':')[0] || ''} onChange={e => setHoraFin(e.target.value + ':' + (horaFin.split(':')[1] || '00'))} className={INPUT_CLASS + " w-20"}>
                        <option value="">HH</option>
                        {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-lg font-bold px-0.5">:</span>
                    <select value={horaFin.split(':')[1] || ''} onChange={e => setHoraFin((horaFin.split(':')[0] || '00') + ':' + e.target.value)} className={INPUT_CLASS + " w-20"}>
                        <option value="">MM</option>
                        {Array.from({length: 12}, (_, i) => String(i * 5).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    </div>
                    <button
                        type="submit"
                        disabled={buscando}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faSearch} className="mr-2" />
                        {buscando ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleImportar}
                        disabled={importando}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                        {importando ? 'Cargando...' : 'Cargar'}
                    </button>
                </div>

                {importResult && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-800">
                            {importResult.mensajes?.join(' | ') || 'Proceso completado'}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Total: {importResult.totalRegistros} | Exitosos: {importResult.exitosos} | Errores: {importResult.errores}
                        </p>
                    </div>
                )}
            </form>

            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <form onSubmit={handleBusquedaSubmit} className="flex items-center gap-2 flex-wrap">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Paciente, ingreso, CUPS o médico..."
                        className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-all">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {busqueda && (
                        <button type="button" onClick={handleLimpiarBusqueda} className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-400 transition-all">
                            Limpiar
                        </button>
                    )}
                    <div className="flex items-center gap-2 ml-4">
                        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Todos los tipos</option>
                            <option value="CIRUGIA">Cirugía</option>
                            <option value="ENDOSCOPIA">Endoscopía</option>
                        </select>
                        <div className="relative" ref={entidadDropdownRef}>
                            <button type="button" onClick={() => setShowEntidadDropdown(!showEntidadDropdown)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-48 truncate text-left flex items-center gap-2">
                                <span className="truncate flex-1">{filtroEntidades.length === 0 ? 'Todas las entidades' : `${filtroEntidades.length} seleccionada(s)`}</span>
                                <svg className={`w-4 h-4 transition-transform ${showEntidadDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {showEntidadDropdown && (
                                <div className="absolute z-30 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[220px]">
                                    <label className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                                        <input type="checkbox" checked={filtroEntidades.length === 0} onChange={() => setFiltroEntidades([])} className="rounded" />
                                        <span className="font-medium">Todas</span>
                                    </label>
                                    {entidades.map(e => (
                                        <label key={e.id} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer">
                                            <input type="checkbox" checked={filtroEntidades.includes(e.id)} onChange={() => {
                                                setFiltroEntidades(prev =>
                                                    prev.includes(e.id) ? prev.filter(id => id !== e.id) : [...prev, e.id]
                                                );
                                            }} className="rounded" />
                                            <span className="truncate">{e.nombre}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <select value={filtroEspecialidad} onChange={e => setFiltroEspecialidad(e.target.value)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-48 truncate">
                            <option value="">Todas las especialidades</option>
                            {especialidades.map(e => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExportarExcel} className="px-3 py-1.5 bg-green-700 text-white text-sm font-semibold rounded hover:bg-green-800 transition-all flex items-center gap-1">
                        <FontAwesomeIcon icon={faFileExcel} />
                        Exportar Excel
                    </button>
                    <span className="text-sm text-gray-500">{totalElementos} registro(s)</span>
                    <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A-</button>
                    <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A+</button>
                </div>
            </div>

            <div style={{ height: 'calc(100vh - 400px)', overflow: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                <table className="w-full min-w-full table-auto text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                    <thead>
                        <tr className="sticky top-0 z-20 bg-gray-800 text-white">
                            <th className="px-2 py-0.5 font-semibold">ID</th>
                            <th className="px-2 py-0.5 font-semibold">Tipo</th>
                            <th className="px-2 py-0.5 font-semibold">Paciente</th>
                            <th className="px-2 py-0.5 font-semibold">Ingreso</th>
                            <th className="px-2 py-0.5 font-semibold">Cups</th>
                            <th className="px-2 py-0.5 font-semibold">Proced.Cod</th>
                            <th className="px-2 py-0.5 font-semibold">Intervención</th>
                            <th className="px-2 py-0.5 font-semibold">Especialidad</th>
                            <th className="px-2 py-0.5 font-semibold">Médico</th>
                            <th className="px-2 py-0.5 font-semibold">Fecha Cargue</th>
                            <th className="px-2 py-0.5 font-semibold">Hora Cargue</th>
                            <th className="px-2 py-0.5 font-semibold">Entidad</th>
                            <th className="px-2 py-0.5 font-semibold">GQX</th>
                            <th className="px-2 py-0.5 font-semibold">Anestesiólogo</th>
                            <th className="px-2 py-0.5 font-semibold">Ayudante 1</th>
                            <th className="px-2 py-0.5 font-semibold">Ayudante 2</th>
                            <th className="px-2 py-0.5 font-semibold">Liquidación</th>
                            <th className="px-2 py-0.5 font-semibold">Novedad</th>
                            <th className="px-2 py-0.5 font-semibold">Autorización</th>
                            <th className="px-2 py-0.5 font-semibold">Obs. Autorización</th>
                            <th className="px-2 py-0.5 font-semibold">Imágenes Dx</th>
                            <th className="px-2 py-0.5 font-semibold">Estado</th>
                            <th className="px-2 py-0.5 font-semibold">Causa Objeción</th>
                            <th className="px-2 py-0.5 font-semibold">Rev Supervision</th>
                            <th className="px-2 py-0.5 font-semibold">Observación</th>
                            <th className="px-2 py-0.5 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(t => {
                            const isEditing = editId === t.id;
                            const cambioMatch = t.estadoAuditoria?.match(/Cambio-(\d+)/);
                            const esCambioRelacionado = cambioMatch !== null;
                            const filaClase = isEditing
                                ? 'bg-yellow-50'
                                : esCambioRelacionado
                                    ? 'bg-blue-50 border-l-4 border-l-blue-400'
                                    : '';
                            return (
                                <tr key={t.id} className={`border-b hover:bg-gray-50 ${filaClase}`}>
                                    <td className="border-r px-1 py-0.5">{t.id}</td>
                                    <td className="border-r px-1 py-0.5">{t.tipoProcedimiento}</td>
                                    <td className="border-r px-1 py-0.5">{t.pacienteNumeroIdentificacion}</td>
                                    <td className="border-r px-1 py-0.5">{t.ingresoNumero}</td>
                                    <td className="border-r px-1 py-0.5">{t.cupsCodigo}</td>
                                    <td className="border-r px-1 py-0.5">{t.procedCod}</td>
                                    <td className="border-r px-1 py-0.5">{t.intervencion}</td>
                                    <td className="border-r px-1 py-0.5">{t.especialidadNombre}</td>
                                    <td className="border-r px-1 py-0.5">{t.medicoNombre}</td>
                                    <td className="border-r px-1 py-0.5">{t.fechaCargue}</td>
                                    <td className="border-r px-1 py-0.5">{t.horaCargue}</td>
                                    <td className="border-r px-1 py-0.5">{t.entidadSaludNombre}</td>
                                    <td className="border-r px-1 py-0.5">{t.gqx}</td>
                                    <td className="border-r px-1 py-0.5">{t.anestesiologoNombre}</td>
                                    <td className="border-r px-1 py-0.5">{t.ayudante1}</td>
                                    <td className="border-r px-1 py-0.5">{t.ayudante2}</td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.liquidacion} onChange={e => updateCell('liquidacion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} placeholder="100%, 75%..." autoFocus />
                                        ) : (t.liquidacion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.novedadDesc} onChange={e => updateCell('novedadDesc', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} placeholder="cx, anes..." autoFocus />
                                        ) : (t.novedadDesc || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={(e) => { e.preventDefault(); startEdit(t.id, t); }}>
                                        {isEditing ? (
                                            <select value={editData.autorizacion} onChange={e => updateCell('autorizacion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={SELECT_INLINE} autoFocus>
                                                {OPCIONES_AUTORIZACION.map(op => <option key={op} value={op}>{op || ''}</option>)}
                                            </select>
                                        ) : (t.autorizacion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.observacionesAutorizacion} onChange={e => updateCell('observacionesAutorizacion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} autoFocus />
                                        ) : (t.observacionesAutorizacion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.imagenesDx} onChange={e => updateCell('imagenesDx', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} autoFocus />
                                        ) : (t.imagenesDx || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={(e) => { e.preventDefault(); startEdit(t.id, t); }}>
                                        {isEditing ? (
                                            <select value={editData.estadoAuditoria} onChange={e => updateCell('estadoAuditoria', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={SELECT_INLINE} autoFocus>
                                                {OPCIONES_ESTADO.map(op => <option key={op} value={op}>{op || ''}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                                t.estadoAuditoria?.startsWith('Cambio-') ? 'bg-orange-200 text-orange-800' :
                                                t.estadoAuditoria?.startsWith('Pendiente Cambio') ? 'bg-blue-200 text-blue-800' :
                                                t.estadoAuditoria === 'Ok' ? 'bg-green-200 text-green-800' :
                                                t.estadoAuditoria === 'Hecho' ? 'bg-blue-200 text-blue-800' :
                                                t.estadoAuditoria === 'No facturable' ? 'bg-red-200 text-red-800' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>{t.estadoAuditoria || ''}</span>
                                        )}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.causaObjecion} onChange={e => updateCell('causaObjecion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} autoFocus />
                                        ) : (t.causaObjecion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.revSupervision || ''}</td>
                                    <td className="border-r px-1 py-0.5">{t.observacionAuditoria || ''}</td>
                                    <td className="px-3 py-2">
                                        <button onClick={() => onEdit(t)}>
                                            <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={26} className="text-center py-4 text-gray-500">
                                    {busqueda ? 'No se encontraron resultados para "' + busqueda + '".' : 'No hay procedimientos registrados.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-2 border-t bg-gray-50">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
