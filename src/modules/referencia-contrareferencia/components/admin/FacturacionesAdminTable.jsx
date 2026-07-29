import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faChevronLeft, faChevronRight, faCog } from '@fortawesome/free-solid-svg-icons';
import { facturacionService } from '../../api/adminService';
import Modal from '../../../../shared/components/Modal';

const ESTADO_OPTS = ['PENDIENTE', 'ACTIVO', 'INACTIVO'];
const ITEMS_PER_PAGE_OPTS = [5, 10, 25, 50];

export function CreateEdit({ item, onClose, onActualizar }) {
  const isEdit = !!item;
  const [formData, setFormData] = useState({
    trasladoId: '',
    documento: '',
    nomPaciente: '',
    ingreso: '',
    servicio: '',
    produccion: '',
    fechaFactura: '',
    factura: '',
    valor: '',
    nombreFacturador: '',
    estado: 'ACTIVO',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        trasladoId: item.trasladoId ?? '',
        documento: item.documento || '',
        nomPaciente: item.nomPaciente || '',
        ingreso: item.ingreso || '',
        servicio: item.servicio || '',
        produccion: item.produccion || '',
        fechaFactura: item.fechaFactura || '',
        factura: item.factura || '',
        valor: item.valor ?? '',
        nombreFacturador: item.nombreFacturador || '',
        estado: item.estado || 'ACTIVO',
      });
    }
  }, [item]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        valor: formData.valor === '' ? null : Number(formData.valor),
      };
      if (isEdit) {
        await facturacionService.actualizar(item.id, payload);
      } else {
        await facturacionService.crear(payload);
      }
      onActualizar();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Modal isOpen onClose={onClose}>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{isEdit ? 'Editar Facturación' : 'Nueva Facturación'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Traslado ID</label>
              <input type="number" value={formData.trasladoId} onChange={e => handleChange('trasladoId', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Documento</label>
              <input type="text" value={formData.documento} onChange={e => handleChange('documento', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Nombre Paciente</label>
              <input type="text" value={formData.nomPaciente} onChange={e => handleChange('nomPaciente', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Ingreso</label>
              <input type="text" value={formData.ingreso} onChange={e => handleChange('ingreso', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Servicio</label>
              <input type="text" value={formData.servicio} onChange={e => handleChange('servicio', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Producción</label>
              <input type="text" value={formData.produccion} onChange={e => handleChange('produccion', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha Factura</label>
              <input type="datetime-local" value={formData.fechaFactura} onChange={e => handleChange('fechaFactura', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Factura</label>
              <input type="text" value={formData.factura} onChange={e => handleChange('factura', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Valor</label>
              <input type="number" step="0.01" value={formData.valor} onChange={e => handleChange('valor', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nombre Facturador</label>
              <input type="text" value={formData.nombreFacturador} onChange={e => handleChange('nombreFacturador', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={formData.estado} onChange={e => handleChange('estado', e.target.value)} className={inputClass}>
                {ESTADO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
              {saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export function View({ item, onClose }) {
  const formatDate = (val) => val ? new Date(val).toLocaleString() : '-';
  const formatCurrency = (val) => {
    if (val == null) return '-';
    return Number(val).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
  };

  const field = (label, value) => (
    <div className="border-b border-gray-200 pb-2">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <p className="text-sm text-gray-800 mt-0.5">{value ?? '-'}</p>
    </div>
  );

  return (
    <Modal isOpen onClose={onClose}>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detalle de Facturación #{item.id}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {field('ID', item.id)}
          {field('Traslado ID', item.trasladoId)}
          {field('Documento', item.documento)}
          {field('Nombre Paciente', item.nomPaciente)}
          {field('Ingreso', item.ingreso)}
          {field('Servicio', item.servicio)}
          {field('Producción', item.produccion)}
          {field('Fecha Factura', formatDate(item.fechaFactura))}
          {field('Factura', item.factura)}
          {field('Valor', item.valor != null ? formatCurrency(item.valor) : '-')}
          {field('Nombre Facturador', item.nombreFacturador)}
          {field('Estado', item.estado)}
        </div>
      </div>
    </Modal>
  );
}

export default function FacturacionesAdminTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await facturacionService.listarTodos();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta facturación?')) return;
    try {
      await facturacionService.eliminar(id);
      loadData();
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActualizar = () => {
    setShowCreate(false);
    setEditingItem(null);
    loadData();
  };

  const handleClose = () => {
    setShowCreate(false);
    setEditingItem(null);
    setViewingItem(null);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Facturaciones</h1>
        <button onClick={() => { setEditingItem(null); setShowCreate(true); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />Nuevo
        </button>
      </div>

      {showCreate && <CreateEdit item={editingItem} onClose={handleClose} onActualizar={handleActualizar} />}
      {viewingItem && <View item={viewingItem} onClose={handleClose} />}

      {loading && (
        <div className="flex justify-center items-center py-16">
          <FontAwesomeIcon icon={faCog} spin size="3x" className="text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
      )}
      {!loading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-16 text-gray-500">No hay facturaciones registradas.</div>
      )}
      {!loading && !error && data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Paciente</th>
                  <th className="px-3 py-2 text-left">Documento</th>
                  <th className="px-3 py-2 text-left">Ingreso</th>
                  <th className="px-3 py-2 text-left">Valor</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{t.id}</td>
                    <td className="px-3 py-2">{t.nomPaciente}</td>
                    <td className="px-3 py-2">{t.documento}</td>
                    <td className="px-3 py-2">{t.ingreso}</td>
                    <td className="px-3 py-2">{t.valor != null ? Number(t.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : '-'}</td>
                    <td className="px-3 py-2">{t.estado}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => setViewingItem(t)} className="text-blue-600 hover:text-blue-800" title="Ver"><FontAwesomeIcon icon={faEye} /></button>
                        <button onClick={() => { setEditingItem(t); setShowCreate(true); }} className="text-yellow-600 hover:text-yellow-800" title="Editar"><FontAwesomeIcon icon={faEdit} /></button>
                        <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Filas por página:</span>
              <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(0); }} className="border border-gray-300 rounded px-2 py-1 text-sm">
                {ITEMS_PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span>Página {page + 1} de {totalPages || 1}</span>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
